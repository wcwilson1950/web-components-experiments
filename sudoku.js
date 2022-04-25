class MySudoku extends HTMLElement {
	#clear_btn;
	#solve_btn;
	#grid;
	#squares;
	#tds;
	#cTd;
	#cRowIndex;
	#cColumnIndex;
	#count;
	#grid_size = 9;
	constructor() {
		super();
		this.shadow = this.attachShadow({mode: 'open'});

    }
		clearSquares() {
 			this.#squares = [1,2,3,4,5,6,7,8,9].map(_ => Array(9).fill(0));
		}
		allFilled() {
			for (let row = 0;row < this.#grid_size;row++) {
				for (let column = 0;column < this.#grid_size;column++) {
					if (this.#squares[row][column] == 0) {
						return false;
					}
				}
			}
			return true;
		}
		connectedCallback() {
			this.render();
			this.#clear_btn = this.shadow.querySelector('#clear_btn');
			this.#solve_btn = this.shadow.querySelector('#solve_btn');
			this.#grid = this.shadow.querySelector('#suduko_grid');
			this.#tds = this.#grid.getElementsByTagName('td');
			this.#clear_btn.addEventListener('click',this.clearTable.bind(this));
			this.#solve_btn.addEventListener('click',this.solve.bind(this));
			this.#cTd = null;
			for (let td of this.#tds) {
				td.addEventListener('click',this.setValue.bind(this))
			}
			this.#squares = [
				[9,0,0,0,0,7,0,0,8],
				[0,0,0,0,0,0,0,0,0],
				[8,0,0,0,0,0,6,0,1],
				[0,9,0,0,7,0,0,0,0],
				[0,0,0,0,0,4,5,0,2],
				[2,0,4,0,0,8,0,0,0],
				[4,0,8,0,0,0,0,0,0],
				[7,0,9,0,4,0,0,5,0],
				[6,0,0,0,1,0,2,7,0]
			];
			this.showTable();
		}
		showTable() {
			for (let td of this.#tds) {
				const {ctd,rowIndex,columnIndex} = this.tdInfo(td);
				td.innerHTML = this.#squares[rowIndex][columnIndex] > 0 ? this.#squares[rowIndex][columnIndex] : '';
				//console.log(`row: ${rowIndex} column: ${columnIndex}`);
			}
		}
		clearTable() {
			for (let td of this.#tds) {
				td.innerHTML = "";
			}
			this.clearSquares();
		}
		tdInfo (td)  { return {td,rowIndex: td.parentNode.rowIndex,columnIndex: td.cellIndex} };
		setValue(event) {
			const {td, rowIndex, columnIndex} = this.tdInfo(event.target);
			console.log(`setValue: ${rowIndex} ${columnIndex}`);
			if (this.#cTd) {
				// take the current input element and store it on the screen
				// and in the squares array. Remove the Input element;
				const cinput = this.#cTd.querySelector('#ctrl');
				if (cinput) {
					this.#cTd.innerHTML = cinput.value;
					if (cinput.value) {
						this.#squares[this.#cRowIndex][this.#cColumnIndex] = cinput.value;
					} else {
						if (this.#cRowIndex && this.#cColumnIndex) {
							this.#squares[this.#cRowIndex][this.#cColumnIndex] = 0;
						}
					}
					cinput.remove();
				}
				this.#cTd = null;
			}
			let num;
			const input = document.createElement('input');
			input.setAttribute('id','ctrl');
			input.value = td.innerHTML;
			input.addEventListener('keydown',event => {
				if (event.which === 27) {
					td.innerHTML = input.value;
					input.value = '';
					this.#squares[this.#cRowIndex][this.#cColumnIndex] = 0;
				} else {
					num = parseInt(String.fromCharCode(event.which),10);
					console.log(num);
					if (isNaN(num)) {
						return false;
					}
					td.innerHTML = num;
					this.#squares[this.#cRowIndex][this.#cColumnIndex] = num;
				};
				input.remove();
				this.#cTd = null;
			});
			td.innerHTML = '';
			td.appendChild(input);
			input.focus();
			this.#cTd = td;
			this.#cRowIndex = rowIndex;
			this.#cColumnIndex = columnIndex;

		}
		isNumberInRow(board,number,row) {
				return board[row][0] == number ||
				board[row][1] == number ||
				board[row][2] == number ||
				board[row][3] == number ||
				board[row][4] == number ||
				board[row][5] == number ||
				board[row][6] == number ||
				board[row][7] == number ||
				board[row][8] == number;
		}
		isNumberInColumn(board,number,column) {
			return (board[0][column] == number) ||
			(board[1][column] == number) ||
			(board[2][column] == number) ||
			(board[3][column] == number) ||
			(board[4][column] == number) ||
			(board[5][column] == number) ||
			(board[6][column] == number) ||
			(board[7][column] == number) ||
			(board[8][column] == number);
		}
		isNumberInBox(board,number,row,column) {
			const localBoxRow = row - row % 3;
			const localBoxColumn = column - column % 3;
			return board[localBoxRow][localBoxColumn] == number ||
			board[localBoxRow][localBoxColumn+1] == number ||
			board[localBoxRow][localBoxColumn+2] == number ||
			board[localBoxRow+1][localBoxColumn] == number ||
			board[localBoxRow+1][localBoxColumn+1] == number ||
			board[localBoxRow+1][localBoxColumn+2] == number ||
			board[localBoxRow+2][localBoxColumn] == number ||
			board[localBoxRow+2][localBoxColumn+1] == number ||
			board[localBoxRow+2][localBoxColumn+2] == number;
		}
		isValidPlacement(board,number,row,column) {
			return !this.isNumberInBox(board,number,row,column) &&
							!this.isNumberInRow(board,number,row) &&
							!this.isNumberInColumn(board,number,column);
		}
		solveBoard(board) {
			for (let row = 0;row < this.#grid_size;row++) {
				for (let column = 0;column < this.#grid_size;column++) {
						if (board[row][column] == 0) {
							for (let numberToTry = 1;numberToTry <= this.#grid_size;numberToTry++) {
								 if (this.isValidPlacement(board,numberToTry,row,column)) {
									 board[row][column] = numberToTry;
									 if (this.solveBoard(board)) {
										 return true;
									 } else {
										 board[row][column] = 0
									 }
								 }
							}
							return false;
						}
				}
			}
			return this.allFilled();
		}
		solve() {
			this.#count = 0;
			if(this.solveBoard(this.#squares)) {
				this.showTable();
			}
		}
		render() {
			this.shadow.innerHTML = `
<style>
#suduko_grid {
	border: 2px solid white;
	border-collapse: collapse;
}

#suduko_grid td {
	width: 64px;
	height: 48px;
	background-color: cadetblue;
	border: 1px solid white;
	color: white;
	text-align: center;
	vertical-align: middle;
	font-weight: bold;
	font-size: 2rem;
}

#ctrl {
	width: 20px;
}

#suduko_grid tbody tr td:nth-child(3),
#suduko_grid tbody tr td:nth-child(6) {
	border-right: 5px solid white
}

#suduko_grid tbody tr:nth-child(3) td,
#suduko_grid tbody tr:nth-child(6) td {
	border-bottom: 5px solid white
}

.button {
	background-color: #4CAF50;
	/* Green */
	border: none;
	color: white;
	padding: 15px 32px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 24px;
}

.row {
	padding: 20px 0;
}
</style>
<div id="suduko_div" style="display: table-cell; border: 5px solid black; padding: 2px;">
<table id="suduko_grid">
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>6</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>
</div>
<div class="row">
    <button id="clear_btn" class="button" style="margin-right: 2em;background-color:dimgray;font-size:12px;">Clear Board</button>
    <button id="solve_btn" class="button">Solve It!</button>
</div>
`;
		}

}
customElements.define('my-sudoku',MySudoku);

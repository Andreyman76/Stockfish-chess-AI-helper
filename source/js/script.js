document.addEventListener('keyup', function(event)
{
  if (event.code === 'KeyH')
  {
    showBestMove();
  }
});

function showBestMove()
{
    try
    {
        let field = getFieldData();
        let ranks = document.querySelector('#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board > div > cg-container > coords');
        let isBlack = ranks.className.includes('black');

        if (isBlack)
        {
            field = rotate90(field);
            field = rotate90(field);
        }

        let fen = createFen(isBlack, field);
        let bestMove = getBestMove(fen, 15);
        alert(bestMove)
    }
    catch(err)
    {
        alert('UNKNOWN');
    }
}

function createFen(isBlack, field)
{
    let result = ''
    let first = true;

    for(let i= 0; i < 8; i++)
    {
        let emptyCells = 0;

        if(first === false)
        {
            result += '/';
        }

        first = false;

        for(let j = 0; j < 8; j++)
        {
            let cell = field[i][j];

            if(cell === ' ')
            {
                emptyCells++;
            }
            else
            {
                if(emptyCells > 0)
                {
                    result += emptyCells.toString();
                }

                result += cell.toString();

                emptyCells = 0;
            }
        }

        if(emptyCells > 0)
        {
            result += emptyCells.toString();
        }
    }

    result += ` ${isBlack ? 'b' : 'w'} - - 1 11`;

    return result;
}

function getFieldData()
{
  let result = [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',],
  ]

  let board = document.querySelector('#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board > div > cg-container');

  let width = getFloatFromPx(board.style.width);
  let height = getFloatFromPx(board.style.height);

  let cellWidth = width / 8;
  let cellHeight = height / 8;

  const children = board.firstChild.childNodes; // children

  for(const cell of children)
  {
    if(cell.tagName !== 'PIECE')
    {
      continue;
    }

    let figure = translateClassName(cell.className);
    let transform = cell.style.transform;
    let transformsPx = transform.replace('translate(', '').replace(')', '').split(', ');

    let x = getFloatFromPx(transformsPx[0]);
    let y = getFloatFromPx(transformsPx[1]);

    let i = Math.round(y / cellWidth);
    let j = Math.round(x / cellHeight);

    result[i][j] = figure;
  }

  return result;
}

function getBestMove(fen, depth)
{
  const url = `https://stockfish.online/api/s/v2.php?fen=${fen}&depth=${depth}`;
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', url, false);
  xmlHttp.send(null);
  const response = JSON.parse(xmlHttp.responseText);
  return response['bestmove'].split(' ')[1];
}

function getFloatFromPx(pxString)
{
  return parseFloat(pxString.replace('px', ''))
}

function translateClassName(className)
{
    let parts = className.split(' ');
    let color = parts[0];
    let figure = parts[1];
    let result;

    if(figure === 'knight')
    {
      result = 'n';
    }
    else
    {
      result = figure[0];
    }

    if(color === 'white')
    {
      result = result.toUpperCase()
    }

    return result;
}

function rotate90(array)
{
  let newArray= [];
  let rows = array[0].length;
  let columns = array.length;

  for(let x = 0; x < rows; x++)
  {
    let newRow = [];

    for(let y = (columns - 1), z = 0; y >= 0; y--, z++)
    {
      newRow[z] = array[y][x];
    }

    newArray[x] = newRow;
  }

  return newArray;
}
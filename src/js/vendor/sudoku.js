function cross(A, B){
  let C = [];
  for (let a in A)
    for (let b in B)
      C.push(A[a] + B[b]);
  return C;
}

function member(item, list){
  for (let i in list)
    if (item == list[i]) return true;
  return false;
}

const rows = ['A','B','C','D','E','F','G','H','I'];
const cols = ['1','2','3','4','5','6','7','8','9'];
const digits = "123456789";
export const squares = cross(rows, cols);
let unitlist = [];
let units = {};


/* export function listSquares() {
  return squares;
}
 */
 export function getUnitList () {

  for (let c in cols)
    unitlist.push(cross(rows, [cols[c]]));
  for (let r in rows)
    unitlist.push(cross([rows[r]], cols));
  const rrows = [['A','B','C'], ['D','E','F'], ['G','H','I']];
  const ccols = [['1','2','3'], ['4','5','6'], ['7','8','9']];
  for (let rs in rrows)
    for (let cs in ccols)
      unitlist.push(cross(rrows[rs], ccols[cs]));

      return unitlist;

 }

 export function getUnits() {

  for (let s in squares){
    units[squares[s]] = [];
    for (let u in unitlist)
      if (member(squares[s], unitlist[u]))
        units[squares[s]].push(unitlist[u]);
  }
   return units;
 }

export function findPeers(cell) {

  let peers = [];
  for (let index = 0; index < units[cell].length; index++) {
    const unit = units[cell][index];

     for (let j = 0; j < unit.length ;j++) {
       const square = unit[j];
          if(!peers.includes(square) && square !== cell) {
            peers.push(square);
          }
      }
     }
     return peers;
  }



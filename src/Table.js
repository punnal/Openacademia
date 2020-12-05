import "./App.css";
import BTable from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
const RowCell = (props) => {
  return <td>{props.attr ? props.attr.toString() : null}</td>;
};
const Row = (props) => {
  console.log(props.row);
  return (
    <tr>
      {props.row.map((attr, id) => (
        <RowCell key={id} attr={attr} />
      ))}
    </tr>
  );
};

const Table = (props) => {
  return (
    <BTable striped bordered hover variant="dark">
      <thead>
        <tr>
          {props.cols.map((col, id) => (
            <th key={id}> {col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, id) => (
          <Row key={id} row={row} />
        ))}
      </tbody>
    </BTable>
  );
};

export default Table;

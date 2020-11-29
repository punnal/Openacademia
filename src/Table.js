import "./App.css";
import BTable from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
const RowCell = (props) => {
  return <td>{props.attr.toString()}</td>;
};
const Row = (props) => {
  console.log(props.row);
  return (
    <tr>
      {props.row.map((attr) => (
        <RowCell attr={attr} />
      ))}
    </tr>
  );
};

const Table = (props) => {
  return (
    <BTable striped bordered hover variant="dark">
      <thead>
        {props.cols.map((col, id) => (
          <th key={id}> {col}</th>
        ))}
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

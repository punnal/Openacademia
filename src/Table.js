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
      <tbody>
        {props.rows.map((row, id) =>
          row.includes(props.filter) || props.filter === "All" ? (
            <Row key={id} row={row} />
          ) : null
        )}
      </tbody>
    </BTable>
  );
};

export default Table;

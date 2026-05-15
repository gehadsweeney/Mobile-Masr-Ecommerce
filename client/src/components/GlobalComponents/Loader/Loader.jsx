import "./Loader.css";

const Loader = () => {
  return (
    <div
      className="container d-flex justify-content-center align-items-center h-100"
      style={{ minHeight: "80vh" }}
    >
      <div className="loader">
        <div className="bar1" />
        <div className="bar2" />
        <div className="bar3" />
        <div className="bar4" />
        <div className="bar5" />
        <div className="bar6" />
        <div className="bar7" />
        <div className="bar8" />
        <div className="bar9" />
      </div>
    </div>
  );
};

export default Loader;

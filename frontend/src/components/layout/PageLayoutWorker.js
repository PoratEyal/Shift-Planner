import NavbarWorker from "../layout/NavbarWorker";

const PageLayoutWorker = (props) => {
    return (
        <div>
            <NavbarWorker {...props}></NavbarWorker>
            {props.children}
        </div>
    );
};

export default PageLayoutWorker;

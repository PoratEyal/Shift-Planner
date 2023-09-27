import Navbar from "../layout/Navbar";

const PageLayout = (props) => {
    return (
        <div>
            <Navbar {...props}></Navbar>
            {props.children}
        </div>
    );
};

export default PageLayout;

import path from "path";

const paths = {
    root: path.dirname(""),
    src: path.join(path.dirname(""), "src"),
    public: path.join(path.dirname(""), "src", "public"),
    views: path.join(path.dirname(""), "src", "views"),
    images: path.join(path.dirname(""), "src", "public", "images"),
};

export default paths;
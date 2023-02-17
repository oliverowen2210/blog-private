import io from "socket.io-client";

const socket = io(process.env.REACT_APP_BLOG_API_URL, {});

export default socket;

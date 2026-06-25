import membersRepositoryGetByEmail from "./members.repository.getbyemail.js";
import membersRepositoryPost from "./members.repository.post.js";

const membersRepository = {
    post: membersRepositoryPost,
    getByEmail: membersRepositoryGetByEmail
};

export default membersRepository;
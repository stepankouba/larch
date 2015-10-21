import Larch from './larch.app.es6';
import LoginView from './ui/view.login.es6';
import RegisterView from './ui/view.register.es6';
import UserMdl from './model/model.user.es6';
import UserSrvc from './services/service.user.es6';

const Login = Larch.create('login');

Login.services([UserSrvc]);

Login.models([UserMdl]);

Login.views([LoginView, RegisterView]);

Login.run();
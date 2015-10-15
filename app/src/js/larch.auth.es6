import Larch from './larch.app.es6';
import UserMdl from './model/model.user.es6';
import UserSrvc from './services/service.user.es6';
import AuthRun from './larch.auth.run.es6';

const Auth = Larch.create('auth');

Auth.services([UserSrvc]);

Auth.models([UserMdl]);

Auth.run(AuthRun);
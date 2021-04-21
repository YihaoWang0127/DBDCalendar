import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../app.config';
import { UserModel } from '../core/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  registerUrl: string;
  getSecQuestionsUrl: string;
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) apiConfig: IAppConfig
  ) {
    this.registerUrl = apiConfig.morganizerAPIEndpoint + apiConfig.register;
    this.getSecQuestionsUrl = apiConfig.morganizerAPIEndpoint + apiConfig.secquestions;
  }

  registerUser(userModel: UserModel) {
    return this.http.post(this.registerUrl, userModel);
  }

  getAllQuestions() {
    return this.http.get(this.getSecQuestionsUrl);
  }
}

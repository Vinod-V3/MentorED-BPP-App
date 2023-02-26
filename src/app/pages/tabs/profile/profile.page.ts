import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { CommonRoutes } from 'src/global.routes';
import * as _ from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/core/services';
import { localKeys } from 'src/app/core/constants/localStorage.keys';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  formData: any = {
    form: [
      { title: 'SESSIONS_ATTENDED',
        key: 'sessionsAttended',
      },
      {
        title: 'ABOUT',
        key: 'about',
      },
      {
        title: 'DESIGNATION',
        key: 'designation',
      },
      {
        title: 'YEAR_OF_EXPERIENCE',
        key: 'experience',
      },
      {
        title: "KEY_AREAS_OF_EXPERTISE",
        key: "areasOfExpertise"
      },
      {
        title: "EDUCATION_QUALIFICATION",
        key: "educationQualification"
      },
      {
        title: "EMAIL_ID",
        key: "emailId"
      },
    ],
    menteeForm:['SESSIONS_ATTENDED'],
    data: {},
  };
  public buttonConfig = {
    label: "EDIT_PROFILE",
    action: "edit"
    
  }
  showProfileDetails: boolean = false;
  username: boolean = true;
  data: any;
  public headerConfig: any = {
    menu: true,
    notification: true,
    headerColor: 'primary',
    label:'PROFILE'
  };
  sessionData={}
  user: any;
  visited:boolean;
  credentialsList:any=[
    {
      type: "identity",
      documentType: "Aadhar",
      documentId: "123456789012",
      url:"http://google.com",
    },
    {
      type: "work",
      experience:"5 years",
      companyName: "Google Inc",
      url:"http://www.google.com"
    },
    {
      type:"skill",
      skill:"B.Tech",
      university:"Mumbai University",
      rollNo:"123",
      YOP:"2018"
    }
  ]
  constructor(public navCtrl: NavController, private profileService: ProfileService, private translate: TranslateService, private router: Router, private localStorage:LocalStorageService) { }

  ngOnInit() {
    this.visited = false;
  }
  async ionViewWillEnter() {
    this.user = await this.localStorage.getLocalData(localKeys.USER_DETAILS)
    console.log(await this.localStorage.getLocalData(localKeys.TOKEN))
    this.fetchProfileDetails();
    this.gotToTop();
  }

  gotToTop() {
    this.content.scrollToTop(1000);
  }

  async fetchProfileDetails() {
    var response = await this.profileService.getProfileDetailsFromAPI(this.user.isAMentor,this.user._id);
    this.formData.data = response;
    this.formData.data.emailId = response.email.address;
    if (this.formData?.data?.about) {
      this.showProfileDetails = true;
    } else {
      (!this.visited)?this.router.navigate([CommonRoutes.EDIT_PROFILE]):null;
      this.visited=true;
    }
  }

  async doRefresh(event){
    var result = await this.profileService.getProfileDetailsFromAPI(this.user.isAMentor,this.user._id);
    if(result){
      this.formData.data = result;
      this.formData.data.emailId = result.email.address;
    }
    event.target.complete();
  }

  feedback() {
    this.navCtrl.navigateForward([CommonRoutes.FEEDBACK]);
  }

  refresh(){
    console.log('REFRESH CALLED')
  }


}

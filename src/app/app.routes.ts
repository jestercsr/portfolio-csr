import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CvComponent } from './cv/cv.component';
import { ContactComponent } from './contact/contact.component';
import { TemplateComponent } from './template/template.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'portfolio', component: PortfolioComponent},
    {path: 'cv', component: CvComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'template', component: TemplateComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];

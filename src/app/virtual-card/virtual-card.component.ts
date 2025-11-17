import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-virtual-card',
  imports: [NgFor],
  templateUrl: './virtual-card.component.html',
  styleUrl: './virtual-card.component.css'
})
export class VirtualCardComponent {
  name = "Jester Cesar";
  title = "Développeur Web Freelance";
  skills = ["React", "Angular"];
  email = "jester.csr@gmail.com";
  portfolio = "https://portfolio-jester-cesar.vercel.app";
  github = "https://github.com/jestercsr";
  linkedin = "https://www.linkedin.com/in/jester-cesar-705201284";
  photoUrl = "/jester-cesar.png";
  qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://linktr.ee/jester_cesar";
  linktreeLogoUrl = "https://static.vecteezy.com/system/resources/previews/048/759/320/non_2x/linktree-transparent-icon-free-png.png";
}

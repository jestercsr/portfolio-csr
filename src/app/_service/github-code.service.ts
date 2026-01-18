import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GithubCodeService {
  constructor(private http: HttpClient) {}

  private headers = new HttpHeaders({
    Authorization: `token ${environment.githubToken}`,
  });

  getRepoTree(owner: string, repo: string) {
    return this.http.get<any>(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
      { headers: this.headers }
    );
  }

  getFileContent(owner: string, repo: string, path: string) {
    return this.http.get<any>(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    );
  }
}

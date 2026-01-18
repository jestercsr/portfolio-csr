import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GithubCodeService {
  constructor(private http: HttpClient) {}

  getRepoTree(owner: string, repo: string) {
    return this.http.get<any>(
      `/api/github?owner=${owner}&repo=${repo}`
    );
  }

  getFileContent(owner: string, repo: string, path: string) {
    return this.http.get<any>(
      `/api/github?owner=${owner}&repo=${repo}&path=${encodeURIComponent(path)}`
    );
  }
}

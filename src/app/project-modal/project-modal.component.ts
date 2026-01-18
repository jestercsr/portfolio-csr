import { Component, OnInit } from '@angular/core';
import { NgbCarousel, NgbModal, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../_models/Project';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { SafePipe } from '../pipes/safe.pipe';
import { GithubCodeService } from '../_service/github-code.service';

@Component({
  selector: 'app-project-modal',
  imports: [NgbCarousel, NgbSlide, NgFor, NgIf, SafePipe, NgTemplateOutlet],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent implements OnInit {
  project = {} as Project;
  activeTab: 'preview' | 'code' = 'preview';
  files: any[] = [];
  selectedFile: any;
  fileContent = '';
  fileTree: any[] = [];

  constructor(public activeModal: NgbModal, private github: GithubCodeService) {}

  ngOnInit() {
    if (this.isGame() && this.project.projectLink) {
      this.loadRepo();
    }
  }

  isGame(): boolean {
    return this.project.type === 'game';
  }

  getGameUrl(): string {
    return this.project.gameUrl || '';
  }

  private loadRepo() {
    const [owner, repo] = this.extractRepoInfo();

    this.github.getRepoTree(owner, repo).subscribe(res => {
      const blobs = res.tree.filter(
        (f: any) =>
          f.type === 'blob' &&
          /\.(ts|tsx|js|jsx|html|css|json)$/.test(f.path)
      );

      this.fileTree = this.buildFileTree(blobs);
      const firstFile = this.findFirstFile(this.fileTree);
      if (firstFile) {
        this.selectFile(firstFile);
      }
    });
  }

  private buildFileTree(files: any[]) {
    const root: any[] = [];

    files.forEach(file => {
      const parts = file.path.split('/');
      let currentLevel = root;

      parts.forEach((part: string, index: number) => {
        let existing = currentLevel.find(n => n.name === part);

        if (!existing) {
          existing = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: index === parts.length - 1 ? 'file' : 'folder',
            icon:
              index === parts.length - 1
                ? this.getFileIcon(part)
                : 'bi-folder',
            expanded: index === 0,
            children: []
          };
          currentLevel.push(existing);
        }

        currentLevel = existing.children;
      });
    });

    return this.sortTree(root);
  }

  private sortTree(nodes: any[]): any[] {
    return nodes
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
      .map(node => ({
        ...node,
        children: node.children ? this.sortTree(node.children) : []
      }));
  }

  toggleFolder(node: any) {
    node.expanded = !node.expanded;
  }

  private findFirstFile(nodes: any[]): any {
    for (const node of nodes) {
      if (node.type === 'file') return node;
      if (node.children?.length) {
        const found = this.findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  }

  FILE_ICON_RULES = [
    // CONFIG
    { match: 'tsconfig', icon: 'material-icon-theme:tsconfig' },
    { match: 'jsconfig', icon: 'material-icon-theme:jsconfig' },
    { match: 'package', icon: 'vscode-icons:file-type-node' },
    { match: 'vite', icon: 'material-icon-theme:vite' },
    { match: 'tailwind', icon: 'material-icon-theme:tailwindcss' },
    { match: 'eslint', icon: 'material-icon-theme:eslint' },
    { match: 'angular', icon: 'material-icon-theme:angular' },
    { match: 'vercel', icon: 'material-icon-theme:vercel' },

    // REACT
    { match: '.tsx', icon: 'material-icon-theme:react-ts' },
    { match: '.jsx', icon: 'material-icon-theme:react' },

    // LANGAGES
    { match: '.ts', icon: 'vscode-icons:file-type-typescript-official' },
    { match: '.js', icon: 'material-icon-theme:javascript' },
    { match: '.html', icon: 'vscode-icons:file-type-html' },
    { match: '.css', icon: 'vscode-icons:file-type-css' },
    { match: '.scss', icon: 'vscode-icons:file-type-scss2' },

    // DOC
    { match: 'readme', icon: 'material-icon-theme:readme' },

    // DATA
    { match: '.json', icon: 'material-icon-theme:json' },
    { match: 'routes', icon: 'material-icon-theme:routing' }
  ];

  FOLDER_ICON_RULES = [
    { match: 'src', icon: 'material-icon-theme:folder-src' },
    { match: 'app', icon: 'material-icon-theme:folder-app' },
    { match: 'components', icon: 'material-icon-theme:folder-components' },
    { match: 'assets', icon: 'material-icon-theme:folder-assets' },
    { match: 'public', icon: 'material-icon-theme:folder-public' },
    { match: 'styles', icon: 'material-icon-theme:folder-styles' },
    { match: 'server', icon: 'material-icon-theme:folder-server' },
    { match: 'node_modules', icon: 'material-icon-theme:folder-node' },
  ];

  getFileIcon(fileName: string, isFolder = false) {
    if (isFolder) {
      const folderName = fileName.toLowerCase();
      for (const rule of this.FOLDER_ICON_RULES) {
        if (rule.match && folderName.includes(rule.match)) {
          return { icon: rule.icon };
        }
      }
      return { icon: 'material-icon-theme:folder' };
    }
    const ext = fileName.toLowerCase();

    for (const rule of this.FILE_ICON_RULES) {
      if (ext.includes(rule.match)) {
        return { icon: rule.icon };
      }
    }

    return { icon: 'material-icon-theme:document' };
  }

  editorOptions = {
    theme: 'vs-dark',
    language: 'typescript', // tu peux changer dynamiquement selon l'extension
    readOnly: true,
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false
  };

  selectFile(file: any) {
    this.selectedFile = file;
    const [owner, repo] = this.extractRepoInfo();

    this.github.getFileContent(owner, repo, file.path).subscribe(res => {
      this.fileContent = atob(res.content);

      // détecte le langage selon extension
      if (file.name.endsWith('.ts')) this.editorOptions = {...this.editorOptions, language: 'typescript'};
      else if (file.name.endsWith('.tsx')) this.editorOptions = {...this.editorOptions, language: 'typescript'};
      else if (file.name.endsWith('.js')) this.editorOptions = {...this.editorOptions, language: 'javascript'};
      else if (file.name.endsWith('.jsx')) this.editorOptions = {...this.editorOptions, language: 'javascript'};
      else if (file.name.endsWith('.html')) this.editorOptions = {...this.editorOptions, language: 'html'};
      else if (file.name.endsWith('.css')) this.editorOptions = {...this.editorOptions, language: 'css'};
    });
  }

  private extractRepoInfo(): [string, string] {
    const parts = this.project.projectLink.split('/');
    return [parts[3], parts[4]];
  }
}

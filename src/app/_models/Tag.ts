export class Tag {
    static readonly NEXTJS = new Tag('Next.js', 'black');
    static readonly REACT = new Tag('React', 'blue');
    static readonly NODEJS = new Tag('Node.js', 'green');
    static readonly TAILWINDCSS = new Tag('Tailwind CSS', 'cyan');
    static readonly BOOTSTRAP = new Tag('Bootstrap', 'mediumblue');
    static readonly ANGULAR = new Tag('Angular', 'red');
    static readonly TYPESCRIPT = new Tag('TypeScript', 'orange');
    static readonly JAVASCRIPT = new Tag('JavaScript', 'yellow');
    static readonly HTML = new Tag('HTML', 'orange');
    static readonly CSS = new Tag('CSS', 'blue');
    static readonly JAVA = new Tag('Java', 'darkred');
    static readonly CPLUSPLUS = new Tag('C++', 'red');
    static readonly PYTHON = new Tag('Python', 'blue');
    static readonly CSHARP = new Tag('C#', 'darkblue');
    static readonly PHP = new Tag('PHP', 'royalblue');
    static readonly MYSQL = new Tag('MySQL', 'cornflowerblue');
    static readonly MONGODB = new Tag('MongoDB', 'chartreuse');
    static readonly SPRING = new Tag('Spring Boot', 'springgreen');


    private constructor(private readonly key: string, public readonly color: string) {}

    toString(): string {
        return this.key;
    }
}
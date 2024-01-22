// Вам необхідно написати додаток Todo list. У списку нотаток повинні бути методи для додавання нового запису, видалення, редагування та отримання повної інформації про нотаток за ідентифікатором, а так само отримання списку всіх нотатік. Крім цього, у користувача має бути можливість позначити нотаток, як виконаний, і отримання інформації про те, скільки всього нотаток у списку і скільки залишилося невиконаними. Нотатки не повинні бути порожніми.
// Кожний нотаток має назву, зміст, дату створення і редагування та статус. Нотатки бувають двох типів. Дефолтні та такі, які вимагають підтвердження при ридагуванні (окремі класи).
// Окремо необхідно розширити поведінку списку та додати можливість пошуку нотатка по будь-якому філду, або у якості опції вказувати по якому саме вести пошук.
// Також окремо необхідно розширити список можливістю сортування нотаток за статусом або часом створення.

interface ITaskType {
  default: "default";
  confirm: "confirm";
}

const TaskTypes: ITaskType = {
  default: "default",
  confirm: "confirm",
};

interface ITask {
  id: number;
  title: string;
  body: string;
  dateCreate: Date;
  dateEdit: Date;
  isFinished: boolean;
}

interface IEditableTask {
  type: ITaskType[keyof ITaskType];
}

abstract class TodoList {
  protected readonly id: number;
  protected readonly dateCreate: Date;
  protected dateEdit: Date;
  protected isFinished: boolean;

  protected tasks: ITask[] = [];

  public title: string;
  public body: string;

  constructor(task: ITask) {
    this.id = task.id;
    this.title = task.title;
    this.body = task.body;
    this.dateCreate = new Date();
    this.dateEdit = task.dateEdit;
    this.isFinished = task.isFinished;
    this.addTask(task);
  }

  public get allTasks(): ITask[] {
    return this.tasks;
  }

  public addTask(task: ITask): void {
    this.tasks.push(task);
  }

  protected unfinishedTasks(): ITask[] {
    return this.tasks.filter((task) => !task.isFinished);
  }

  protected countAllTasks(): number {
    return this.tasks.length;
  }

  public finishTask(id: number): void {
    this.tasks.forEach((task) => {
      if (task.id === id && !task.isFinished) {
        task.isFinished = true;
      }
    });
  }

  public getTaskInfo(id: number): ITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  public addTask(task: ITask): void {
    this.tasks.push(task);
  }

  public deleteTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  public abstract editTask(task: ITask): void;
}

class DefaultTodoList extends TodoList implements IEditableTask {
  public readonly type: keyof ITaskType;

  constructor(task: ITask, type: keyof ITaskType) {
    super(task);
    this.type = type;
  }

  public editTask(task: ITask): void {
    this.tasks.forEach((element) => {
      if (element.id === task.id) {
        element.title = task.title;
        element.body = task.body;
        element.dateEdit = task.dateEdit;
        element.isFinished = task.isFinished;
      }
    });
  }
}

class ConfirmTodoList extends TodoList implements IEditableTask {
  public readonly type: keyof ITaskType;

  constructor(task: ITask, type: keyof ITaskType) {
    super(task);
    this.type = type;
  }

  public editTask(task: ITask): boolean {
    const result = confirm("Please confirm the task edit");
    if (result) {
      this.tasks.forEach((element) => {
        if (element.id === task.id) {
          element.title = task.title;
          element.body = task.body;
          element.dateEdit = task.dateEdit;
          element.isFinished = task.isFinished;
        }
      });
    }
    return result;
  }
}

class FindTodoTask extends TodoList {
  public editTask(task: ITask): void {
    throw new Error("Editing functionality is not available for this class");
  }

  public findTodoTask(
    field: keyof ITask,
    value: string | number | boolean
  ): ITask[] {
    return this.tasks.filter((todo) => todo[field] === value);
  }
}

class SortTask extends TodoList {
  public editTask(task: ITask): void {
    throw new Error("Editing functionality is not available for this class");
  }

  public sortTasks(compareFn: (a: ITask, b: ITask) => number): ITask[] {
    return this.tasks.sort(compareFn);
  }
}

import TaskModel from '../tasks-model';

export const voidTask: TaskModel = {
    '_id': '',
    'title': '',
    'details': '',
    'datelimit': new Date(0),
    'renders': [],
    'correction': '',
}

export default voidTask;
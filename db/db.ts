import {
    SQLiteDatabase,
    enablePromise,
    openDatabase,
} from 'react-native-sqlite-storage'
import { tags } from 'react-native-svg/lib/typescript/xml'

// Enable promise for SQLite
enablePromise(true)


export const connectToDatabase = async () => {
    return openDatabase(
        { name: "toDoList.db", location: "default" },
        () => { },
        (error) => {
            console.error(error)
            throw Error("Could not connect to database")
        }
    )
}

export const createTables = async (db: SQLiteDatabase) => {
    const toDoListQuery = `
    CREATE TABLE IF NOT EXISTS todolist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        createdDate TEXT DEFAULT CURRENT_TIMESTAMP,
        status INTEGER DEFAULT 0 CHECK (status IN (0, 1)),
        userId INTEGER, -- Add userId column for foreign key reference
        FOREIGN KEY (userId) REFERENCES users(id)
    );
    `
    const usersQuery = `
    CREATE TABLE IF NOT EXISTS users (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       firstName TEXT,
       email TEXT,
       password TEXT,
       phoneNumber TEXT
    )
   `
    try {
        console.log('tables created successfully')
        await db.executeSql(toDoListQuery)
        await db.executeSql(usersQuery)
    } catch (error) {
        console.error(error)
        throw Error(`Failed to create tables`)
    }
}
// drop table
export const dropTable = async (tableName: string) => {
    connectToDatabase().then(async (db) => {
        try {
            await db.executeSql(`DROP TABLE IF EXISTS ${tableName}`);
            console.log('Table dropped successfully')
        }

        catch (error) {
            console.error(error)
            throw Error(`Failed to drop table`)
        }

    })
}

export const createUser = async (
    firstName: string,
    email: string,
    phoneNumber: string,
    password: string
): Promise<void | { message: string; data: any; }> => {
    return connectToDatabase().then(async (db) => {
        try {
            const isUnique = await db.executeSql('SELECT count(*) FROM users where phoneNumber = ?', [phoneNumber]);
            console.log(isUnique[0].rows.raw()[0]['count(*)']);
            if (isUnique[0].rows.raw()[0]['count(*)'] === 0) {
                let res = await db.executeSql(
                    'INSERT INTO users (firstName, email, phoneNumber, password) VALUES (?, ?, ?, ?)',
                    [firstName, email, phoneNumber, password]
                );
                console.log(res)
                // 99243589
                console.log('User created successfully');
                return { message: 'Амжилттай бүртгэгдлээ', data: res };
            } else {
                return { message: 'Энэ утасны дугаар дээр хэрэглэгч бүргэгдсэн байна.', data: '' };
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }).catch((error) => {
        console.error(error)
    })
};

export const getUsers = async (): Promise<void> => {
    connectToDatabase().then(async (db) => {
        try {
            const results = await db.executeSql('SELECT * FROM users');
            const users = results[0].rows.raw();
            console.log('users:')
            console.log(users)
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }).catch((error) => {
        console.error(error)
    })
};
export const loginUser = async (
    email: string,
    password: string): Promise<{ message: string; data: any; }> => {
    return connectToDatabase().then(async (db) => {
        try {
            const res = await db.executeSql('SELECT * FROM users where email = ? and password = ?', [email, password]);

            console.log(res[0].rows.raw())
            if (res[0].rows.raw().length === 1) {
                
                return { message: 'Амжилттай нэвтэрлээ', data: res[0].rows.raw()[0] };
            } else {
                return { message: 'Цахим хаяг эсвэл нууц үг буруу байна', data: '' };
            }
            // 99243596
            // Bbbaaabar2
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }).catch((error) => {
        console.error(error)
        return { message: error, data: '' }
    })

}
export const createTask = async (
    userId: number,
    task: string,
    status: number = 0
): Promise<void> => {
    return connectToDatabase().then(async (db) => {
        try {
            const res = await db.executeSql(
                'INSERT INTO todolist (userId, task, status) VALUES (?, ?, ?)',
                [userId, task, status]
            );
            // console.log(res[0].rows.raw())
            getTaskById(res[0].insertId).then((task) => {
                return task;
            })
            console.log('Task created successfully');
        } catch (error) {
            console.error('Error creating task:', error);
            throw new Error('Failed to create task');
        }
    }).catch((error) => {
        console.error(error)
    })
};

const getTaskById = async (
    taskId: number): Promise<any> => {
    return connectToDatabase().then(async (db) => {
        try {
            const results = await db.executeSql(
                'SELECT * FROM todolist WHERE id = ? ',
                [taskId]
            );
            const task = results[0].rows.raw();
            return task;
        } catch (error) {
            console.error('Error fetching task:', error);
            throw new Error('Failed to fetch task');
        }
    }).catch((error) => {
        console.error(error)
    })
}

export const getTasksByUserId = async (
    userId: number
): Promise<any> => {
    return connectToDatabase().then(async (db) => {
        try {
            const results = await db.executeSql(
                'SELECT * FROM todolist WHERE userId = ? order by status ',
                [userId]
            );
            const tasks = results[0].rows.raw();
            return { message: 'success', data: tasks }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw new Error('Failed to fetch tasks');
        }
    }).catch((error) => {
        console.error(error)
    })
}
export const getTasks = async (): Promise<any> => {
    return connectToDatabase().then(async (db) => {
        try {
            const results = await db.executeSql('SELECT * FROM todolist');
            const tasks = results[0].rows.raw();
            // console.log(tasks)
            return tasks;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw new Error('Failed to fetch tasks');
        }
    }).catch((error) => {
        console.error(error)
    })

}

export const updateTaskStatus = async (
    taskId: number,
    status: boolean
): Promise<void> => {
    connectToDatabase().then(async (db) => {
        try {
            await db.executeSql(
                'UPDATE todolist SET status = ? WHERE id = ?',
                [status, taskId]
            );
            console.log('Task status updated successfully');
        } catch (error) {
            console.error('Error updating task status:', error);
            throw new Error('Failed to update task status');
        }
    }).catch((error) => {
        console.error(error)
    });
};


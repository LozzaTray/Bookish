import DbConnection from "../db/DbConnection";
import { Router, Response } from "express";
import BaseModel from '../models/BaseModel';

export default abstract class BaseController{
    dbc: DbConnection;
    router: Router;
    tableName: String;

    constructor(dbc: DbConnection, tableName: String){
        this.dbc = dbc;
        this.router = Router();
        this.tableName = tableName;

        //map routes
        this.router.get('/', /*passport */ this.getAll.bind(this));
        this.router.get('/:id', /*passport */ this.getById.bind(this));

        this.router.post('/', /*passport */ this.createNew.bind(this));
    }

    //#region GET requests
    // '/'
    async getAll(request, response: Response){
        let queryString: String = `
            SELECT *
            FROM ${this.tableName};
        `;

        let jsonDbArray = await this.dbc.asyncAll(queryString);
        let modelArray = jsonDbArray.map((jsonBook) => new BaseModel(jsonBook));

        response.json(modelArray);
    }

    // '/:id'
    async getById(request, response: Response){
        response.send('API endpoint not yet implemented');    
    }

    // helper method
    async getByIdSupplied(id: Number, idName: String){
        let queryString = `
            SELECT *
            FROM ${this.tableName}
            WHERE ${idName} = ${id}; 
        `;

        let json = await this.dbc.asyncOneOrNone(queryString);
        return json;
    }
    //#endregion


    //#region POST requests
    // '/'
    async createNew(request, response: Response){
        let jsonModel = request.params;

        let columnNamesArray = jsonModel.keys;
        let columnNamesCsv = columnNamesArray.join(',');

        let valuesArray = [];
        for(let key of columnNamesArray){
            valuesArray.push(jsonModel[key]);
        }
        let valuesCsv = valuesArray.join(',');

        let queryString = `
            INSERT INTO LibraryUsers(${columnNamesCsv})
            VALUES (${valuesCsv});
        `;

        try{
            await this.dbc.asyncNone(queryString);
            response.sendStatus(201);
        }
        catch{
            response.send('Failed to create new object');
        }
    }
}
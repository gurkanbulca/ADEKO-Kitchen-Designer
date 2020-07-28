import axios from "axios";
import { parameters } from "./parameters"


export class Axios {
    static get = function () {
        return axios.getMeshesFromAPI("/meshes")
            .then(res => {
                res.data.meshArray.map(meshInfo => {
                    parameters.placedMeshes.push(createMeshFromMeshInfo(meshInfo));
                })

            }).catch(err => console.error(err));
    }
}
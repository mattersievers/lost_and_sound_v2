import React from "react";
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_EQUIPMENT } from "../utils/queries";
import {REMOVE_EQUIPMENT} from '../utils/mutations'
import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';

const SavedEquipment = () => {
    const { loading, data: userData } = useQuery(GET_MY_EQUIPMENT);
    const [removeEquipment] = useMutation(REMOVE_EQUIPMENT);
    const history = useHistory();

    const submitDelete = async(event) =>{
        event.preventDefault();
        console.log(event.target.id)
        if(window.confirm('Delete this item?')){
            await removeEquipment({
                variables: { _id: event.target.id}
            })
            window.location.reload();
        }    
    }

    const submitEdit = (event) => {
        event.preventDefault();
        history.push('./edit', [event.target.id])
    }

    if(loading) {
        return <h1> LOADING... </h1>
    }
    return(
        <div className="savedEquipmentContent mainContent">
            <div className="userEquipContainer card blackTable">
                <h1 className="userName">
                    {userData.me.savedEquipment.length 
                    ? `${userData.me.firstName}  ${userData.me.lastName}'s Equipment:`
                    : "You have not saved any equipment yet." }
                </h1>
                <div className="align-self-center">
                    {userData.me.savedEquipment.map((item, i) => {
                        return (
                            <div className="lBlueTable" key={i} >
                                <ul className="lostItemList">
                                    <li>                      
                                    {item.image.map((singleImage, j) => {
                                        return (
                                            <CloudinaryContext cloudName="dgeknrish" key={j}>
                                                <Image publicId={singleImage} className="equipImage">
                                                <Transformation width="200" crop="scale"/>
                                                </Image>
                                            </CloudinaryContext> 
                                        )
                                    })}
                                    </li>
                                    <li>Category: {item.category}</li>
                                    <li>Brand: {item.brand}</li>
                                    <li>Model: {item.model}</li>
                                    <li>Description: {item.description}</li>
                                    <li>Serial Number:  {item.serialNumber}</li>
                                    <li>{item.lost? `Your item has been reported lost.` : `You have this item.`}</li>
                                    <li><button onClick={submitDelete} id={item._id}>Delete</button><button onClick={submitEdit} id={item._id}>Edit</button></li>
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
           
        </div>
    )
}

export default SavedEquipment;
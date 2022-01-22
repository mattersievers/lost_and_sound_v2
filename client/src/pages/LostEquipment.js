import React,{useState} from "react";
import { useQuery } from '@apollo/client';
import { GET_EQUIPMENT } from '../utils/queries';
import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';
import FilterForm from '../components/FilterForm';


const LostEquipment = () => {
    const { loading, data: userData } = useQuery(GET_EQUIPMENT);
    const [ equipFilter, setEquipFilter] = useState({distance: 4000})

    if(loading) {
        return <h1> LOADING... </h1>
    }

    return(
        <div className="lostEquipmentContent mainContent">
            <div className="welcomeText">
                <h1>
                    WELCOME TO <span className="websiteTitle">Lost and Sound!</span>
                </h1>
                <h2>
                    Report and recover lost musical instruments and accessories.
                </h2>
            </div> 
            <div className="blackTable card align-items-center">
                <h2>Missing Equipment:</h2>

                <FilterForm equipFilter = {equipFilter}/>
                
                <div>
                    {userData.users.map((user, i) => {
                        let link = `mailto: ${user.email}`
                        if(user.hasLost) {
                            return (
                                <div key={i} className="dBlueTable card">
                                    <div className="userName">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <a href={link}>Contact the owner.</a>
            
                                    {user.savedEquipment.map((item, j) => {                                    
                                        if (item.lost) {
                                            return(
                                                <div key={j} className="lBlueTable">
                                                    <ul className="lostItemList">
                                                        <li>
                                                        {item.image.map((singleImage, j) => {
                                                            return (
                                                                <CloudinaryContext cloudName="dgeknrish" key={j}>
                                                                    <Image publicId={singleImage}  className="equipImage">
                                                                    <Transformation crop="scale" />
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
                                                    </ul>
                                                    
                                                </div>    

                                            )
                                        }
                                    })}
                                </div>
                            )
                        }
                        
                    })}
                </div>    
            </div> 
        
        </div>
    )
}

export default LostEquipment;
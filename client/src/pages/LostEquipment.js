import React,{useState, useEffect} from "react";
import { useQuery } from '@apollo/client';
import { GET_EQUIPMENT } from '../utils/queries';
import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';
import FilterForm from '../components/FilterForm';
import Fade from 'react-reveal/Fade';
import { MapContainer, TileLayer} from 'react-leaflet';
import Location from "../components/Location";

const LostEquipment = () => {
    const { loading, data: userData } = useQuery(GET_EQUIPMENT);
    const [equipFilter, setEquipFilter] = useState({distance: 13000, category:'All'});
    const [filterToggle, setFilterToggle] = useState(false);
    const [position, setPosition] = useState(null);
    const [lostDistances, setLostDistances] = useState([]);

    useEffect(()=>{

        
    },[lostDistances])
    
    //userData still loading
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
                    REPORT AND RECOVER LOST MUSICAL INSTRUMENTS AND ACCESSORIES
                </h2>
            </div> 
            <div className="blackTable card align-items-center">
                <h2>Missing Equipment:</h2>
                <Fade top collapse when={filterToggle} duration={3000}>
                    <div>
                        <FilterForm 
                        equipFilter = {equipFilter}
                        setEquipFilter={setEquipFilter}/>
                        <button onClick={()=>setFilterToggle(false)}>Collapse</button>
                    </div>
                </Fade>
                <Fade bottom collapse when={!filterToggle} duration={3000}>
                <button onClick={()=>setFilterToggle(true)}>Filters</button>
                </Fade>
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{height: "0", width:"0"}}>
                        <TileLayer
                            attribution='Open Street Maps'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Location 
                        position={position}
                        setPosition={setPosition}
                        userData = {userData}
                        lostDistances = {lostDistances}
                        setLostDistances = {setLostDistances}
                        />  
                </MapContainer>


                <div>
                    {userData.users.filter(user=>
                        user.hasLost &&
                        (user.savedEquipment.filter(equipment => (equipment.lost && equipment.category === equipFilter.category) || (equipment.lost && equipFilter.category==='All')).length > 0) &&
                        lostDistances.filter(el => el.miles< equipFilter.distance).some(el=> el.userEmail === user.email)
                    )
                    .map((user, i) => {
                        let link = `mailto: ${user.email}`

                        return (
                            <div key={i} className="dBlueTable card">
                                <div className="userName">
                                    {user.firstName} {user.lastName}
                                </div>
                                <a href={link}>Contact the owner.</a>
        
                                {user.savedEquipment
                                .filter( item => 
                                    (item.category === equipFilter.category || equipFilter.category === 'All') &&
                                    lostDistances.filter(el => el.miles< equipFilter.distance).some(el=> el.userEquip === user.email.concat(user.savedEquipment.indexOf(item)))
                                )
                                .map((item, j) => {                                    
                                    if (item.lost) {
                                        return(
                                            <div key={j} className="lBlueTable">
                                                <ul className="lostItemList">
                                                    <li>
                                                    {item.image.map((singleImage, k) => {
                                                        return (
                                                            <CloudinaryContext cloudName="dgeknrish" key={k}>
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
                                    } else {return null}
                                })}
                            </div>
                        )
                    })}
                </div>    
            </div> 
        
        </div>
    )
}

export default LostEquipment;
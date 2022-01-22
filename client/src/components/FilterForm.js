import React from "react";

const FilterForm = (props) => {
    
    const handleFormSubmission = (event) => {
        event.preventDefault();
        console.log(event.target)
        const { name, value } = event.target;
        props.setEquipFilter({...props.equipFilter, [name]:value});
    }

    return(
        <div className="filterFormElement">
            <h3>Filter by</h3>
            <form className="filterForm" onSubmit={handleFormSubmission}>
                <label htmlFor="distance">Distance: </label>
                <select value={props.equipFilter.distance} name="distance" onChange={handleFormSubmission}>
                    <option value="4000">Any</option>
                    <option value="300">300 miles</option>
                    <option value="200">200 miles</option>
                    <option value="100">100 miles</option>
                    <option value="50">50 miles</option>
                    <option value="25">25 miles</option>
                </select>
                <label htmlFor="category">Category: </label>
                  <select name="category" type="category" id="category" onChange={handleFormSubmission} className="textInput">
                    <option value="All">All</option>  
                    <option value="Guitar">Guitar</option>
                    <option value="Bass">Bass</option>
                    <option value="Drums">Drums</option>
                    <option value="Keyboard">Keyboard/Piano</option>
                    <option value="Amp">Amp/Speaker</option>
                    <option value="Pedals">Pedal/Effect/Mixer</option>
                    <option value="Brass">Horn/Brass</option>
                    <option value="Woodwind">Woodwind</option>
                    <option value="Reed">Reed</option>
                    <option value="Other">Other</option>
                  </select>
            </form>
        </div>    
    )

}

export default FilterForm
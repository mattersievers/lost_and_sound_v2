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
            </form>
        </div>    
    )

}

export default FilterForm
import React from 'react'
import { Card, Col, Input, FormGroup } from 'reactstrap';

export default function SearchSite({ id, site, handleChange, Data, name }) {
    return (
        <Col>
            <FormGroup>
                <Input type='select' id={id} name={name} value={site} onChange={handleChange}>
                    <option value="" disabled defaultValue>Select Site</option>
                    {Data.map((site, i) => (
                        <option key={i} value={site.id}> {site.site_name} </option>))}
                </Input>
            </FormGroup>
        </Col>
    )
}

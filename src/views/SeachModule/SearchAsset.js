import React from 'react'
import { Card, Col, Input, FormGroup } from 'reactstrap';

export default function SearchAsset({ id, asset, handleChange, Data, name }) {
    return (
        <Col >
            <FormGroup>
                <Input type='select' id={id} name={name} value={asset} onChange={handleChange} >
                    <option value="" disabled defaultValue>Select Asset </option>
                    {Data.map((ast, i) => (
                        <option key={i} value={ast.id}>{ast.asset_name}</option>))}
                </Input>
            </FormGroup>
        </Col>
    )
}

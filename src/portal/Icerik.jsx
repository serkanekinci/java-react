import React from "react";
import {ShallowComponent,Store,RemoteEndPoint,AjaxRequest,Assertions} from "robe-react-commons";
import Card from "./../card/Card";
import DataGrid from "robe-react-ui/lib/datagrid/DataGrid";
import ModalDataForm from "robe-react-ui/lib/form/ModalDataForm";
import IcerikModel from  "./IcerikModel.json";
export default class Icerik extends ShallowComponent{
    static idField = "oid";
    altDersRequest = new AjaxRequest({
        url:"altders",
        type:"GET"
    });
    constructor(props){
        super(props);
        let store = new Store({
            endPoint:new RemoteEndPoint({
                url:"dersler"
            }),
            idField:Icerik.idField
        });
        this.state ={
            store:store,
            fields:IcerikModel.fields,
            propsOfFields:{
                altDersOid:{
                    items:[]
                }
            }
        }
    }
    render(){
        return(
            <Card header={this.state.name}>
                <DataGrid
                    store={this.state.store}
                    fields={this.state.fields}
                    ref={"table"}
                    toolbar={[{name: "create", text: "Ekle"},
                        {name: "edit", text: "Düzenle"},
                        {name: "delete", text: "Sil"}]}
                    onNewClick={this.__add}
                    onEditClick={this.__edit}
                    onDeleteClick={this.__remove}
                    pagination={{emptyText: "No data.", pageSize: 20}}
                    modalConfirm={{header: "Please do not delete me."}}
                    pageSizeButtons={["20", "50", "100"]}
                    refreshable={true}
                    pageable={true}
                    editable={true}
                    cellRenderer={this.__cellRenderer}
                />
                <ModalDataForm
                    ref="detailModal"
                    header="Menü Yönetimi"
                    show={this.state.showModal}
                    propsOfFields={this.state.propsOfFields}
                    fields={this.state.fields}
                    onSubmit={this.__onSave}
                    onCancel={this.__onCancel}
                    defaultValues={this.state.item}
                />
            </Card>
        );
    }
    __add() {
        let empty = {};
        this.__showModal(empty);
    }

    __edit() {
        let selectedRows = this.refs.table1.getSelectedRows();
        if (!selectedRows || !selectedRows[0]) {
            return;
        }
        this.__showModal(selectedRows[0]);
    }

    __onCancel() {
        this.setState({showModal: false});
    }

    __onSave(newData, callback) {
        let id = newData[Icerik.idField];
        newData.altDers = this.__findRoleObject(newData.altDersOid);
        if (Assertions.isNotEmpty(id)) {
            this.state.store.update(newData);
        } else {
            this.state.store.create(newData);
        }
        if (newData) {
            callback(true);
            this.setState({
                showModal: true
            });
        }
        // this.refs[DataGridSample.tableRef].__readData();
    }

    __remove() {
        let selectedRows = this.refs.table1.getSelectedRows();
        this.state.store.delete(selectedRows[0]);
    }

    __showModal(newItem) {
        this.setState({showModal: true, item: newItem});
    }
    __cellRenderer(idx: number, fields: Array, row: Object) {
        if(fields[idx].name =='name') {
            return <td key={fields[idx].name}>{row.name}</td>;
        }
        if(fields[idx].name =='aciklama') {
            return <td key={fields[idx].name}>{row.aciklama}</td>;
        }
        if(fields[idx].name =='icerikAlani') {
            return <td key={fields[idx].name}>{row.icerikAlani}</td>;
        }
        if(fields[idx].name == 'altDersOid') {
            return <td key={fields[idx].name}>{row.altDers.name}</td>;
        }
    }
    componentDidMount(){
        this.altDersRequest.call(undefined, undefined, function (response) {
            let state = {};
            state.items = response;
            state.propsOfFields = this.state.propsOfFields;
            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                state.propsOfFields.altDersOid.items.push({
                    value: res.oid,
                    text: res.name
                });
            }
            this.setState(state);
            this.forceUpdate();
        }.bind(this));
    }
    __findRoleObject(selectedOid: String){
        for(let i = 0; i < this.state.items.length; i++){
            let roleObject = this.state.items[i];
            if(roleObject && roleObject.oid === selectedOid)
                return roleObject;
        }
        return undefined;
    }
}
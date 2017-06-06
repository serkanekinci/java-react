import React from "react";
import {ShallowComponent,Store,AjaxRequest,Assertions,RemoteEndPoint} from "robe-react-commons";
import DataGrid from "robe-react-ui/lib/datagrid/DataGrid";
import ModalDataForm from "robe-react-ui/lib/form/ModalDataForm";
import ModelAltDers from "./ModelAltDers.json";
import Card from "./../../card/Card";
export default class AltDersEkle extends ShallowComponent{
    static idField = "oid";
    anaDersRequest = new AjaxRequest({
        url:"anaders",
        type:"GET"
    });
    constructor(props){
        super(props);
        let store = new Store({
            endPoint:new RemoteEndPoint({
                url:"altders",
                read: {
                    url: "altders"
                }
            }),
            idField:AltDersEkle.idField
        });
        this.state = {
            store:store,
            fields : ModelAltDers.fields,
            showModal:false,
            item :{},
            propsOfFields:{
                anaDersOid:{
                    items:[]
                }
            }
        }
    }
    render(){
        return(
            <Card header="Alt Ders Düzenleme">
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
        let id = newData[AltDersEkle.idField];
        newData.anaDers = this.__findRoleObject(newData.anaDersOid);
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
        if(fields[idx].name == 'anaDersOid') {
            return <td key={fields[idx].name}>{row.anaDers.name}</td>;
        }
    }
    componentDidMount(){
         this.anaDersRequest.call(undefined, undefined, function (response) {
            let state = {};
            state.items = response;
            state.propsOfFields = this.state.propsOfFields;
            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                state.propsOfFields.anaDersOid.items.push({
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
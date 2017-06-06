import React from "react";
import {ShallowComponent,Store,AjaxRequest,Assertions,RemoteEndPoint} from "robe-react-commons";
import DataGrid from "robe-react-ui/lib/datagrid/DataGrid";
import ModalDataForm from "robe-react-ui/lib/form/ModalDataForm";
import DersModel from "./DersModel.json";
import Card from "./../../card/Card";
export default class AnaDersEkle extends ShallowComponent{
    static idField = "oid";
    constructor(props){
        super(props);
        let store = new Store({
            endPoint:new RemoteEndPoint({
                url:"anaders"
            }),
            idField:AnaDersEkle.idField
        });
        this.state = {
            store:store,
            fields : DersModel.fields,
            item:{},
            showModal:false
        }
    }
    render(){
        return(
            <Card header="Ana Ders Düzenleme">
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
        let selectedRows = this.refs.table.getSelectedRows();
        if (!selectedRows || !selectedRows[0]) {
            return;
        }
        this.__showModal(selectedRows[0]);
    }

    __onCancel() {
        this.setState({showModal: false});
    }

    __onSave(newData, callback) {
        let id = newData[AnaDersEkle.idField];
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
        let selectedRows = this.refs.table.getSelectedRows();
        this.state.store.delete(selectedRows[0]);
    }

    __showModal(newItem) {
        this.setState({showModal: true, item: newItem});
    }
}
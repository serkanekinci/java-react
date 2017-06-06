import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Arrays from "robe-react-commons/lib/utils/Arrays"
import PermissionModel from "./PermissionModel.json";
import {Tabs,Tab,Label,Col,Panel} from "react-bootstrap";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import SelectInput from "robe-react-ui/lib/inputs/SelectInput";
import CheckTree from "robe-react-ui/lib/checktree/CheckTree";
import CheckInput from "robe-react-ui/lib/inputs/CheckInput";
import Toast from "robe-react-ui/lib/toast/Toast";
import Button from "robe-react-ui/lib/buttons/Button"

export default class Permission extends ShallowComponent{
    static idField="oid";
    readRequest = new AjaxRequest({
        url:"roles",
        type:"GET"
    });

    getPermissionRequest = new AjaxRequest({
        url:"permissions/endPoints",
        type:"GET"
    });

    getPermissionMenuRequest = new AjaxRequest({
        url:"permissions/menus",
        type:"GET"
    });

    constructor(props){
        super(props);
        this.componentWillReceiveProps(props);
    }
    componentWillReceiveProps(nextProps){
        this.state = {
            fields: PermissionModel.fields,
            value: [],
            valueMenu: [],
            data:Permission.data,
            permissionData:[],
            permissionMenuData:[],
            roleOid:"e03b193a71a6448c9d263d981f330813",
            roleValue: [],
            SingleSelect: "",
            UserSelect:"",
            buttonText:"Tümünü Seç",
            buttonTextMenu:"Tümünü Seç",
            item: {},
            propsOfFields:{
                role:{
                    items:[]
                }

            }
        };

    }
    render(){
        return(
            <div>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Servis İzinleri">
                    <Col md={6}>
                        <SelectInput
                            name="SingleSelect"
                            items={this.state.propsOfFields.role.items}
                            textField="value"
                            valueField="oid"
                            readOnly={true}
                            value={this.state.SingleSelect}
                            onChange={this.__handleChange}
                        />
                    </Col>
                    <Col md={2}>
                        <Button onClick={this.__AllSelection} bsStyle="primary">{this.state.buttonText}</Button>
                    </Col>
                    <Col md={2}>
                        <Button onClickAsync={this.__saveData} bsStyle="info">Kaydet</Button>
                    </Col>
                    <Col md={12}>

                    <Panel>
                    <CheckTree
                        items={this.state.permissionData}
                        value={this.state.value}
                        onChange={this.handleChange}
                        ref="checkTree"
                    />
                    </Panel>
                </Col>
                </Tab>
                <Tab eventKey={2} title="Menü İzinleri">
                    <Col md={6}>
                    <SelectInput
                        name="UserSelect"
                        items={this.state.propsOfFields.role.items}
                        textField="value"
                        valueField="oid"
                        readOnly={true}
                        value={this.state.UserSelect}
                        onChange={this.__handleChangeSelect}
                    />

                    </Col>
                    <Col md={2}>
                        <Button onClick={this.__allSelectionMenu} bsStyle="danger">{this.state.buttonTextMenu}</Button>
                    </Col>
                    <Col md={2}>
                        <Button onClick={this.__saveDataMenu} bsStyle="info">Kaydet</Button>
                    </Col>
                    <Col md={12}>
                    <Panel>
                        <CheckTree
                            ref="checkTreeMenu"
                            items={this.state.permissionMenuData}
                            value={this.state.valueMenu}
                            onChange={this.handleChange}

                        />
                    </Panel>
                    </Col>
                </Tab>
             </Tabs>
             </div>)
    }

    handleChange = (e: Object) => {

    };

    shouldComponentUpdate(): boolean {
        return true;
    }
    __click(){
        let selectedRows = this.refs.table.getSelectedRows();
        if(selectedRows[0].active == false){
            selectedRows[0].active = true;
        }
        else{
            selectedRows[0].active = false;
        }
        //this.state.store.update(selectedRows);

        if (!selectedRows || !selectedRows[0]) {
            return;
        }
    }
    loginSuccess(done: Function) {
        Toast.warning("Kayıt Başarılı Biraz Bekleyin");
        // done method is important
        // Call this after all operations are done (at the end of AJAX)

        done();
    }
    __loginError(response, textStatus, xhr) {
        var text = response.responseText;
        switch (response.status) {
            case 200:
                text = "";
                break;
            case 401:
                text = "Kullanıcı adı ya da şifre hatalı girdiniz.";
                break;
            case 500:
                if (text == "User blocked.") {
                    text = "Çok fazla hatalı giriş yaptınız.";
                }
                else {
                    text = "Kullanıcı adı ya da şifre hatalı girdiniz.";
                }
                break;
            default:
                text = "Lütfen daha sonra tekrar deneyiniz.";
                break;
        }

    }

    static cellRenderer(idx: number, fields: Array, row: Object) {
        if (fields[idx].name == 'path') {
            return <td key={fields[idx].name}>{row.path}</td>;
        }

        if (fields[idx].name == 'active') {
            if(row.active == true){
                return <td key={fields[idx].name}>{
                    <FaIcon code="fa-check-square-o"/>
                }</td>;}
            else{
                return <td key={fields[idx].name}>{
                    <FaIcon code="fa-square-o"/>
                }</td>;}

        }

        if (fields[idx].name == 'method') {
                return <td key={fields[idx].name}>{row.method}</td>;

        }



    }

    __saveDataMenu(e: Object, done: Function){
        let selectOidMenu = this.state.UserSelect;
        this.AllSaveMenuPermissionRequest = new AjaxRequest({
            url:"permissions/configuresMenu/"+selectOidMenu,
            type:"POST"
        });
        let selectDataMenu = this.state.valueMenu;
        this.AllSaveMenuPermissionRequest.call(selectDataMenu,undefined,function (response) {
            done();
            Toast.warning("Kayıt Başarılı");
        },this.__loginError,undefined);
    }

    __allSelectionMenu(e: Object){
        if(this.state.buttonTextMenu === "Tümünü Seç"){
            let deger = "İptal Et"
            this.AllSelectPermissionRequest = new AjaxRequest({
                url:"permissions/menus",
                type:"GET"
            });
            this.AllSelectPermissionRequest.call(undefined, undefined, function (response) {
                let state = {};
                for (let i = 0; i < response.length; i++) {
                    let res = response[i];
                    this.state.valueMenu.push(res.code);
                    if(res.children){
                        for (let a=0;a<res.children.length;a++)
                            this.state.valueMenu.push(res.children[a].code);

                    }
                }
                state["buttonTextMenu"]=deger;
                this.setState(state);
                this.forceUpdate();
            }.bind(this));
        }else{
            let deger = "Tümünü Seç";
            this.roleRequest = new AjaxRequest({
                url:"permissions/menus/"+this.state.roleOid+"",
                type:"GET"
            });
            this.roleRequest.call(undefined, undefined, function (response) {
                let state = {};
                this.state.valueMenu = [];
                for (let i = 0; i < response.length; i++) {
                    let res = response[i];
                    this.state.valueMenu.push(res);
                }
                state["buttonTextMenu"]=deger;
                this.setState(state);
                this.forceUpdate();
            }.bind(this));
        }

    }
    __AllSelection(e: Object){

        if(this.state.buttonText === "Tümünü Seç"){
        let deger = "İptal Et"
        this.AllSelectPermissionRequest = new AjaxRequest({
            url:"permissions/endPoints",
            type:"GET"
        });
        this.AllSelectPermissionRequest.call(undefined, undefined, function (response) {
            let state = {};
            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                this.state.value.push(res.code);
                if(res.children){
                    for (let a=0;a<res.children.length;a++)
                        this.state.value.push(res.children[a].code);

                }
            }
            state["buttonText"]=deger;
            this.setState(state);
            this.forceUpdate();
        }.bind(this));
        }else{
            let deger = "Tümünü Seç";
            this.roleRequest = new AjaxRequest({
                url:"permissions/endPoints/"+this.state.roleOid+"",
                type:"GET"
            });
            this.roleRequest.call(undefined, undefined, function (response) {
                let state = {};
                this.state.value = [];
                for (let i = 0; i < response.length; i++) {
                    let res = response[i];
                    this.state.value.push(res);
                }
                state["buttonText"]=deger;
                this.setState(state);
                this.forceUpdate();
            }.bind(this));
        }
    }
    __saveData(e: Object, done: Function){
        let selectOid = this.state.SingleSelect;
        this.AllSavePermissionRequest = new AjaxRequest({
            url:"permissions/configurePermission/"+selectOid,
            type:"POST"
        });
        let selectData = this.state.value;
        this.AllSavePermissionRequest.call(selectData,undefined,function (response) {
            done();
            Toast.warning("Kayıt Başarılı");
        },this.__loginError,undefined);

    }
    componentDidMount() {

        this.getPermissionMenuRequest.call(undefined, undefined, function (response) {
            let state = {};
            state.permissionMenuData = this.state.permissionMenuData;

            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                state.permissionMenuData.push({
                    text: res.text,
                    code:res.code,
                    children:res.children || []
                });

            }
            this.setState(state);
            this.forceUpdate();
        }.bind(this));
        //tüm izinler
        this.getPermissionRequest.call(undefined, undefined, function (response) {
            let state = {};
            state.permissionData = this.state.permissionData;

            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                    state.permissionData.push({
                    text: res.text,
                    code:res.code,
                    children:res.children || []
                });

            }
            this.setState(state);
            this.forceUpdate();
        }.bind(this));
        //combobox içine gelen veri
        this.readRequest.call(undefined, undefined, function (response) {
            let state = {};
            state.propsOfFields = this.state.propsOfFields;

            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                if (Arrays.indexOfByKey(state.propsOfFields.role.items, "value", res.oid) === -1) {
                    state.propsOfFields.role.items.push({
                        oid: res.oid,
                        value:res.name
                    });
                }

            }
            this.setState(state);
            this.forceUpdate();
        }.bind(this));
        //oid gönderildikten sonraki veri ()
        //Kullanıcılar değiştirkten sonra içerik değişecek


    }
    __handleChangeSelect(e: Object){
      let state = {};
      let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
      state[e.target.name] = value;
      let roleOid= e.target.value;
      state["roleOid"] = e.target.value;
      this.setState(state);
      this.menuGetRequest = new AjaxRequest({
            url:"permissions/menus/"+roleOid+"",
            type:"GET"
        });
      this.menuGetRequest.call(undefined, undefined, function (response) {
            let state = {};
            this.state.valueMenu = [];
            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                this.state.valueMenu.push(res);
            }
            this.setState(state);
            this.forceUpdate();
        }.bind(this));

    }
    __handleChange(e: Object) {

        let state = {};
        let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
        state[e.target.name] = value;
        //state["data"] = this.state.permissionData;
        //state["roleOid"] = e.target.value;
        let roleOid= e.target.value;
        state["roleOid"] = e.target.value;
        this.setState(state);
        this.roleRequest = new AjaxRequest({
            url:"permissions/endPoints/"+roleOid+"",
            type:"GET"
        });
        this.roleRequest.call(undefined, undefined, function (response) {
            let state = {};
            this.state.value = [];
            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                this.state.value.push(res);
            }
            this.setState(state);
            this.forceUpdate();
        }.bind(this));

    }

}
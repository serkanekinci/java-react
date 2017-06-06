import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import SideMenu from "robe-react-ui/lib/sidemenu/SideMenu";
import SidePanel from "robe-react-ui/lib/sidepanel/SidePanel";
import Header from "../header/Header";
import Card from "../card/Card";
import {Col,Button} from "react-bootstrap";

export default class Workspace extends ShallowComponent {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            toggled: false,
            leftPanelState: false,
            name : "Menü Aç"
        };
    }


    render() {
        let toggled="";
        if(this.state.leftPanelState === true){
            toggled= this.state.toggled == false ? 0 : 290;
        }else{
            toggled = this.state.toggled == false ? 0 : 0;
        }
        return (
            <div >
                <Header
                    matches={this.state.matches}
                    toggled={this.state.toggled}
                    onToggle={this.__changeMenu}
                />

                <SidePanel visible={this.state.leftPanelState} position="left">
                <Col
                    id="sideMenu"
                    style={{width: toggled}}
                    className="side-menu menumustafa">
                    <Card style={{marginLeft: 0}} className="menumustafa">

                            <SideMenu
                            items={this.props.route.menu}
                            selectedItem={"Dashboard"}
                            onChange={this.__handleChange}/>

                    </Card>
                </Col>
                </SidePanel>
                <Col
                    id="content"
                    className="content"
                    style={{height: window.innerHeight - 80, marginLeft: toggled}}
                    onClick={this.__closeMenu}>
                    <Button md={12} onClick={this.__panelOpen}>{this.state.name}</Button>
                    {this.props.children}
                </Col>
            </div>
        );
    }
    __panelOpen(){
        if(this.state.leftPanelState === false)
            this.setState({leftPanelState:!this.state.leftPanelState,name:"Menü Kapat"})
        else
            this.setState({leftPanelState:!this.state.leftPanelState,name:"Menü Aç"})
    }
    __handleChange = (item) => {
        this.context.router.push(item.module);
    };

    __closeMenu = () => {
        if (this.state.matches == true) {
            this.setState({
                toggled: false
            });
        }
    };
    __changeMenu = () => {
        if (this.state.matches == true) {
            this.setState({
                toggled: !this.state.toggled
            });
        }
    };

    __mediaQueryChanged = (mql) => {
        this.setState({
            toggled: !mql.matches,
            matches: mql.matches
        });

    };

    componentWillMount() {
        const mql = window.matchMedia("screen and (max-width: 768px)");
        mql.addListener(this.__mediaQueryChanged);
        this.setState({matches: mql.matches, toggled: !mql.matches});

        this.context.router.listen(this.__closeMenu);

        let initialSelection = window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1);
        if (initialSelection) {
            this.context.router.push(initialSelection);
        }
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.__mediaQueryChanged);
        this.context.router.listen(null);
    }
}

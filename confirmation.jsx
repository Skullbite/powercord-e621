/* Copyright (C) 2020 TaiAurori (Gabriel Sylvain) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the MIT license.
 * Basically, you can change and redistribute this code
 * but this copyright notice must remain unmodified.
 */
const { Modal } = require("powercord/components/modal")
const { FormTitle, Button } = require("powercord/components")
const { close } = require("powercord/modal")
const { React, getModule, messages, channels } = require("powercord/webpack")
const { clipboard, shell } = require("electron")

module.exports = class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPrompt: null
        };
        this.closeModal = this.closeModal.bind(this)
        this.confirmModal = this.confirmModal.bind(this)
    }
    closeModal() {
        close()
        this.props.onReject ? this.props.onReject() : null
    }
    confirmModal() {
        close()
        this.props.onConfirm ? this.props.onConfirm() : null
    }
    render() { 
        return <Modal size={ Modal.Sizes.SMALL }>
            <Modal.Header>
                <FormTitle tag="h3">
                    {this.props.titleText ? this.props.titleText : "Woah, there!"}
                </FormTitle>
                <Modal.CloseButton onClick={ this.closeModal } />
            </Modal.Header>
            <Modal.Content>
                <div className="text-2F8PnX colorStandard-2KCXvj">{this.props.children && Object.keys(this.props.children).length > 0 ? this.props.children : "Are you sure you really want to do this?"}</div>
            </Modal.Content>
            <Modal.Footer>
                <Button
                    style={{ marginRight: "10px"}}
                    onClick={this.confirmModal}
                    color={Button.Colors.GREEN}
                >
                Do it!
                </Button>
                <Button
                    style={{ marginRight: "10px"}}
                    onClick={this.closeModal}
                    color={Button.Colors.RED}
                >
                Nevermind...
                </Button>
            </Modal.Footer>
        </Modal>
    }
}
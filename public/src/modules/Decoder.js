import CircuitElement from '../circuitElement';
import { Node, findNode } from '../node';
import simulationArea from '../simulationArea';
import {
    correctWidth, lineTo, moveTo, rect, fillText,
} from '../canvasApi';
/**
 * @class
 * Decoder
 * @extends CircuitElement
 * @param {number} x - x coordinate of element.
 * @param {number} y - y coordinate of element.
 * @param {Scope=} scope - Cirucit on which element is drawn
 * @param {string=} dir - direction of element
 * @param {number=} bitWidth - bit width per node.
 */
export default class Decoder extends CircuitElement {
    constructor(x, y, scope = globalScope, dir = 'LEFT', bitWidth = 1) {
        super(x, y, scope, dir, bitWidth);
        // this.controlSignalSize = controlSignalSize || parseInt(prompt("Enter control signal bitWidth"), 10);
        this.outputsize = 1 << this.bitWidth;
        this.xOff = 0;
        this.yOff = 1;
        if (this.bitWidth === 1) {
            this.xOff = 10;
        }
        if (this.bitWidth <= 3) {
            this.yOff = 2;
        }

        // this.changeControlSignalSize = function(size) {
        //     if (size === undefined || size < 1 || size > 32) return;
        //     if (this.controlSignalSize === size) return;
        //     let obj = new window[this.objectType](this.x, this.y, this.scope, this.direction, this.bitWidth, size);
        //     this.cleanDelete();
        //     simulationArea.lastSelected = obj;
        //     return obj;
        // }
        // this.mutableProperties = {
        //     "controlSignalSize": {
        //         name: "Control Signal Size",
        //         type: "number",
        //         max: "32",
        //         min: "1",
        //         func: "changeControlSignalSize",
        //     },
        // }
        // eslint-disable-next-line no-shadow
        this.newBitWidth = function (bitWidth) {
            // this.bitWidth = bitWidth;
            // for (let i = 0; i < this.inputSize; i++) {
            //     this.outputs1[i].bitWidth = bitWidth
            // }
            // this.input.bitWidth = bitWidth;
            if (bitWidth === undefined || bitWidth < 1 || bitWidth > 32) return;
            if (this.bitWidth === bitWidth) return;
            const obj = new window[this.objectType](this.x, this.y, this.scope, this.direction, bitWidth);
            this.cleanDelete();
            simulationArea.lastSelected = obj;
            return obj;
        };

        this.setDimensions(20 - this.xOff, this.yOff * 5 * (this.outputsize));
        this.rectangleObject = false;
        this.input = new Node(20 - this.xOff, 0, 0, this);

        this.output1 = [];
        for (let i = 0; i < this.outputsize; i++) {
            const a = new Node(-20 + this.xOff, +this.yOff * 10 * (i - this.outputsize / 2) + 10, 1, this, 1);
            this.output1.push(a);
        }

        // this.controlSignalInput = new Node(0,this.yOff * 10 * (this.outputsize / 2 - 1) +this.xOff + 10, 0, this, this.controlSignalSize,"Control Signal");
    }

    /**
     * @memberof Decoder
     * fn to create save Json Data of object
     * @return {JSON}
     */
    customSave() {
        const data = {
            constructorParamaters: [this.direction, this.bitWidth],
            nodes: {
                output1: this.output1.map(findNode),
                input: findNode(this.input),
            },
        };
        return data;
    }

    /**
     * @memberof Decoder
     * resolve output values based on inputData
     */
    resolve() {
        for (let i = 0; i < this.output1.length; i++) { this.output1[i].value = 0; }
        this.output1[this.input.value].value = 1;
        for (let i = 0; i < this.output1.length; i++) { simulationArea.simulationQueue.add(this.output1[i]); }
    }

    /**
     * @memberof Decoder
     * function to draw element
     */
    customDraw() {
        var ctx = simulationArea.context;

        const xx = this.x;
        const yy = this.y;

        // ctx.beginPath();
        // moveTo(ctx, 0,this.yOff * 10 * (this.outputsize / 2 - 1) + 10 + 0.5 *this.xOff, xx, yy, this.direction);
        // lineTo(ctx, 0,this.yOff * 5 * (this.outputsize - 1) +this.xOff, xx, yy, this.direction);
        // ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = ('rgba(0,0,0,1)');
        ctx.lineWidth = correctWidth(4);
        ctx.fillStyle = 'white';
        moveTo(ctx, -20 + this.xOff, -this.yOff * 10 * (this.outputsize / 2), xx, yy, this.direction);
        lineTo(ctx, -20 + this.xOff, 20 + this.yOff * 10 * (this.outputsize / 2 - 1), xx, yy, this.direction);
        lineTo(ctx, 20 - this.xOff, +this.yOff * 10 * (this.outputsize / 2 - 1) + this.xOff, xx, yy, this.direction);
        lineTo(ctx, 20 - this.xOff, -this.yOff * 10 * (this.outputsize / 2) - this.xOff + 20, xx, yy, this.direction);

        ctx.closePath();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected === this || simulationArea.multipleObjectSelections.contains(this)) { ctx.fillStyle = 'rgba(255, 255, 32,0.8)'; }
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        // [xFill,yFill] = rotate(xx + this.output1[i].x - 7, yy + this.output1[i].y + 2);
        // //console.log([xFill,yFill])
        for (let i = 0; i < this.outputsize; i++) {
            if (this.direction === 'LEFT') fillText(ctx, String(i), xx + this.output1[i].x - 7, yy + this.output1[i].y + 2, 10);
            else if (this.direction === 'RIGHT') fillText(ctx, String(i), xx + this.output1[i].x + 7, yy + this.output1[i].y + 2, 10);
            else if (this.direction === 'UP') fillText(ctx, String(i), xx + this.output1[i].x, yy + this.output1[i].y - 5, 10);
            else fillText(ctx, String(i), xx + this.output1[i].x, yy + this.output1[i].y + 10, 10);
        }
        ctx.fill();
    }
}

/**
 * @memberof Decoder
 * Help Tip
 * @type {string}
 */
Decoder.prototype.tooltipText = 'Decoder ToolTip : Converts coded inputs into coded outputs.';
Decoder.prototype.helplink = 'https://docs.circuitverse.org/#/decodersandplexers?id=decoder';

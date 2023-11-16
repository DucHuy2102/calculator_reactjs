import { useReducer } from 'react';
import './styles.css';
import ButtonDigit from './ButtonDigit';
import OperationButtonDigit from './OperationButtonDigit';

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    DELETE_DIGIT: 'delete-digit',
    CLEAR: 'clear',
    CHOOSE_OPERATION: 'choose-operation',
    EVALUATE: 'evaluate',
};

const reducer = (state, { type, payload }) => {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            // console.log('type:' + typeof state.currentOperand);
            // console.log('state: ' + typeof state);
            // console.log('payload: ' + typeof payload);
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false,
                };
            }
            if (state.currentOperand === '0' && payload.digit === '0') return state;
            if (state.currentOperand?.includes('.') && payload.digit === '.') return state;
            return {
                ...state,
                currentOperand: `${state.currentOperand || ''}${payload.digit}`,
            };
        case ACTIONS.CLEAR:
            return {};
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null,
                };
            }
            if (state.currentOperand == null) return state;
            if (state.currentOperand.length === 1) {
                return {
                    ...state,
                    currentOperand: null,
                };
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1),
            };
        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null) return state;

            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                };
            }

            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null,
                };
            }
            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null,
            };
        case ACTIONS.EVALUATE:
            if (state.operation == null || state.currentOperand == null || state.previousOperand == null) return state;
            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state),
            };
        default:
            throw new Error('!!! Oh no !!!');
    }
};

// format number
const interger_formatter = new Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0,
});
function formatOperand(operand) {
    if (operand == null) return;
    const [integer, decimal] = operand.split('.');
    if (decimal == null) return interger_formatter.format(integer);
    return `${interger_formatter.format(integer)}.${decimal}`;
}

function evaluate({ currentOperand, previousOperand, operation }) {
    const previous = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(previous) || isNaN(current)) return '';
    let result = '';
    switch (operation) {
        case '+':
            result = previous + current;
            break;
        case '-':
            result = previous - current;
            break;
        case '*':
            result = previous * current;
            break;
        case '/':
            result = previous / current;
            break;
    }
    return result.toString();
}

function App() {
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

    return (
        <div className='calculator-grid'>
            <div className='output'>
                <div className='previous-operand'>
                    {formatOperand(previousOperand)} {operation}
                </div>
                <div className='current-operand'>{formatOperand(currentOperand)}</div>
            </div>
            <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
                AC
            </button>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
            <OperationButtonDigit operation='/' dispatch={dispatch} />
            <ButtonDigit digit='1' dispatch={dispatch} />
            <ButtonDigit digit='2' dispatch={dispatch} />
            <ButtonDigit digit='3' dispatch={dispatch} />
            <OperationButtonDigit operation='*' dispatch={dispatch} />
            <ButtonDigit digit='4' dispatch={dispatch} />
            <ButtonDigit digit='5' dispatch={dispatch} />
            <ButtonDigit digit='6' dispatch={dispatch} />
            <OperationButtonDigit operation='+' dispatch={dispatch} />
            <ButtonDigit digit='7' dispatch={dispatch} />
            <ButtonDigit digit='8' dispatch={dispatch} />
            <ButtonDigit digit='9' dispatch={dispatch} />
            <OperationButtonDigit operation='-' dispatch={dispatch} />
            <ButtonDigit digit='.' dispatch={dispatch} />
            <ButtonDigit digit='0' dispatch={dispatch} />
            <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
                =
            </button>
        </div>
    );
}

export default App;


import VariableCreationPanel from '../VariableCreationPanel/VariableCreationPanel';
import LogicalOperationsSelectionPanel from '../LogicalOperationsSelectionPanel/LogicalOperationsSelectionPanel';

import './App.scss';

const App: React.FC = () => {

    return (
        <div className="App">
            <VariableCreationPanel />
            <LogicalOperationsSelectionPanel />
        </div>
    )
}

export default App;

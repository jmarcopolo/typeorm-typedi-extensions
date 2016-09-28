import {ConnectionManager} from "typeorm";
import {Container} from "typedi";

/**
 * Allows to inject an Connection using typedi's Container.
 */
export function OrmConnection(connectionName: string = "default"): Function {
    return function(target: Object|Function, propertyName: string, index?: number) {

        const getValue = () => {
            const connectionManager = Container.get(ConnectionManager);
            if (!connectionManager.has(connectionName))
                throw new Error(`Cannot get connection "${connectionName}" from the connection manager. ` +
                `Make sure you have created such connection. Also make sure you have called useContainer(Container) ` +
                `in your application before you established a connection and importing any entity.`);

            return connectionManager.get(connectionName);
        };

        if (index !== undefined) {
            Container.registerParamHandler({ type: target as Function, index: index, getValue: getValue });
        } else {
            Container.registerPropertyHandler({ target: target as Function /* todo: looks like typedi wrong type here */, key: propertyName, getValue: getValue });
        }
    };
}
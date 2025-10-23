// https://primereact.org/treeselect/ -> Reference

'use client'
import React, { useEffect, useState } from 'react'
import { TreeSelect } from 'primereact/treeselect';
import { treeSelect } from '@/sampleData';

const TreeSelectInputs = () => {

    const [nodes, setNodes] = useState(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState("");

    useEffect(() => {
        treeSelect.getTreeNodes().then((data) => setNodes(data));
    }, []);

    //This code is used for labeling catergory and subcategory in input
    const findNodeByKey = (key, nodeList, parentLabel = "") => {
        for (let node of nodeList) {
            if (node.key === key) {
                return { label: parentLabel ? `${parentLabel} / ${node.label}` : node.label };
            }
            if (node.children) {
                const found = findNodeByKey(key, node.children, node.label);
                if (found) return found;
            }
        }
        return null;
    };

    const handleChange = (e) => {
        setSelectedNodeKey(e.value);
        const selectedNode = findNodeByKey(e.value, nodes);
        setSelectedLabel(selectedNode ? selectedNode.label : "");
    };

    return (
        <>
            <TreeSelect value={selectedLabel} onChange={handleChange} options={nodes}
                filter className="forms-select-2" placeholder={selectedLabel || "Select Categories"}></TreeSelect>
        </>
    )
}

export default TreeSelectInputs
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    fetchGraphHealth,
    fetchGraphStatistics,
    fetchRuralCreditFlow,
    fetchCircularNominees,
    fetchGroupRiskExposure,
    fetchShortestPath,
    fetchVillagePerformance,
    fetchMultiPhoneMembers,
    fetchGraphVisualization
} from '../services/api';

const LABEL_COLORS = {
    Member: '#2b6cb0',
    CooperativeSociety: '#c05621',
    CooperativeGroup: '#2f855a',
    VillageArea: '#b7791f',
    SavingsAccount: '#6b46c1',
    Loan: '#c53030',
    Repayment: '#2c7a7b',
    Fund: '#4c51bf',
    Staff: '#4a5568',
    Entity: '#718096'
};

const QUERIES = [
    {
        id: 'rural-credit-flow',
        title: '1. Multi-Hop Rural Credit Flow',
        tag: 'Multi-Hop Traversal',
        description: 'Traces capital allocation from an institutional funding pool through loans, borrower members, and Self-Help Groups out to the rural village areas where they operate (traversing 5 entity types without relational joins).',
        hasInputs: true,
        inputs: [{ name: 'fundId', label: 'Fund ID', type: 'number', defaultValue: 303 }]
    },
    {
        id: 'circular-nominees',
        title: '2. Circular Nominee Fraud Loop Detection',
        tag: 'Fraud & Collusion Detection',
        description: 'Detects mutual nominee loops (Member A nominates Member B, and Member B nominates Member A) for their savings accounts. This microfinance collusion pattern requires complex recursive CTEs in SQL, but is captured natively in 3 lines of Cypher pattern matching.',
        hasInputs: false
    },
    {
        id: 'group-risk-exposure',
        title: '3. Group Joint-Liability & Risk Exposure',
        tag: 'Risk Aggregation',
        description: 'In microfinance Joint Liability Groups (JLGs), members co-guarantee each other\'s loans. This query aggregates total borrowings, total collected repayments, and net outstanding credit liability across all groups.',
        hasInputs: false
    },
    {
        id: 'shortest-path',
        title: '4. Social & Institutional Shortest Path',
        tag: 'Graph Pathfinding',
        description: 'Finds the shortest relationship path between two members across different societies, groups, or nominee arrangements using Neo4j\'s bidirectional Breadth-First Search (BFS) algorithm.',
        hasInputs: true,
        inputs: [
            { name: 'member1Id', label: 'Member 1 ID', type: 'number', defaultValue: 1 },
            { name: 'member2Id', label: 'Member 2 ID', type: 'number', defaultValue: 3 }
        ]
    },
    {
        id: 'village-performance',
        title: '5. Village Capital Deployment & Recovery',
        tag: 'Spatial Analytics',
        description: 'Evaluates rural development by Village Area: active groups, registered members, total loans issued, capital disbursed, and total repayments collected. Employs node-identity deduplication to handle multi-installment fan-out.',
        hasInputs: false
    },
    {
        id: 'multi-phone-members',
        title: '6. Multi-Valued Contact Array Filtering',
        tag: '1NF Comparison',
        description: 'Extracts members holding multiple contact numbers using native array filtering (size(m.phoneNumbers) > 1) and indexing ([0], [1]), highlighting how graph document properties eliminate relational join tables.',
        hasInputs: false
    }
];

const GraphAnalytics = () => {
    // High-level states
    const [activeSection, setActiveSection] = useState('analytics'); // 'analytics' | 'visualizer'
    const [health, setHealth] = useState(null);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [statsError, setStatsError] = useState(null);

    // Selected Query States
    const [selectedQueryId, setSelectedQueryId] = useState('circular-nominees');
    const [queryInputs, setQueryInputs] = useState({ fundId: 303, member1Id: 1, member2Id: 3 });
    const [queryData, setQueryData] = useState(null);
    const [queryLoading, setQueryLoading] = useState(false);
    const [queryError, setQueryError] = useState(null);

    // Visualizer States
    const [visData, setVisData] = useState(null);
    const [visLimit, setVisLimit] = useState(100);
    const [visLoading, setVisLoading] = useState(false);
    const [visError, setVisError] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [filterLabel, setFilterLabel] = useState('ALL');
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const svgRef = useRef(null);

    // 1. Load Health & Statistics
    const loadOverview = async () => {
        setLoadingStats(true);
        setStatsError(null);
        try {
            const [healthRes, statsRes] = await Promise.all([
                fetchGraphHealth().catch(err => ({ status: 'DOWN', error: err.message })),
                fetchGraphStatistics()
            ]);
            setHealth(healthRes);
            setStats(statsRes);
        } catch (err) {
            setStatsError(err.message || 'Failed to load graph status');
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        loadOverview();
    }, []);

    // 2. Load Selected Query
    const executeQuery = useCallback(async (queryId = selectedQueryId) => {
        setQueryLoading(true);
        setQueryError(null);
        setQueryData(null);
        try {
            let result = null;
            if (queryId === 'rural-credit-flow') {
                result = await fetchRuralCreditFlow(queryInputs.fundId || 303);
            } else if (queryId === 'circular-nominees') {
                result = await fetchCircularNominees();
            } else if (queryId === 'group-risk-exposure') {
                result = await fetchGroupRiskExposure();
            } else if (queryId === 'shortest-path') {
                const m1 = queryInputs.member1Id !== undefined && queryInputs.member1Id !== '' ? Number(queryInputs.member1Id) : 1;
                const m2 = queryInputs.member2Id !== undefined && queryInputs.member2Id !== '' ? Number(queryInputs.member2Id) : 3;
                result = await fetchShortestPath(m1, m2);
            } else if (queryId === 'village-performance') {
                result = await fetchVillagePerformance();
            } else if (queryId === 'multi-phone-members') {
                result = await fetchMultiPhoneMembers();
            }
            setQueryData(result);
        } catch (err) {
            setQueryError(err.message || 'Query execution failed');
        } finally {
            setQueryLoading(false);
        }
    }, [selectedQueryId, queryInputs]);

    // Auto-run when selected query changes
    useEffect(() => {
        if (activeSection === 'analytics') {
            executeQuery(selectedQueryId);
        }
    }, [selectedQueryId, activeSection, executeQuery]);

    // 3. Load Visualization Data
    const loadVisualization = useCallback(async (limit = visLimit) => {
        setVisLoading(true);
        setVisError(null);
        setSelectedNode(null);
        try {
            const data = await fetchGraphVisualization(limit);
            setVisData(data);
        } catch (err) {
            setVisError(err.message || 'Failed to load visualization data');
        } finally {
            setVisLoading(false);
        }
    }, [visLimit]);

    useEffect(() => {
        if (activeSection === 'visualizer' && !visData) {
            loadVisualization(visLimit);
        }
    }, [activeSection, visData, visLimit, loadVisualization]);

    // Layout computation for SVG Graph
    const computedGraph = useMemo(() => {
        if (!visData || !visData.nodes) return { nodes: [], links: [] };

        const rawNodes = visData.nodes;
        const rawLinks = visData.relationships || [];

        // Filter nodes if filterLabel != 'ALL'
        const filteredNodes = filterLabel === 'ALL'
            ? rawNodes
            : rawNodes.filter(n => (n.labels && n.labels.includes(filterLabel)) || n.label === filterLabel);

        const nodeMap = new Map();
        const width = 850;
        const height = 550;
        const centerX = width / 2;
        const centerY = height / 2;

        const total = filteredNodes.length;
        filteredNodes.forEach((node, i) => {
            // Clustered circular distribution by label
            const angle = (i / (total || 1)) * 2 * Math.PI;
            const radius = Math.min(width, height) * 0.38 + ((i % 3) * 25);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            nodeMap.set(node.id, {
                ...node,
                x,
                y,
                color: LABEL_COLORS[node.label] || LABEL_COLORS.Entity
            });
        });

        // Filter and map links
        const validLinks = [];
        rawLinks.forEach(link => {
            const source = nodeMap.get(link.source);
            const target = nodeMap.get(link.target);
            if (source && target) {
                validLinks.push({
                    ...link,
                    sourceNode: source,
                    targetNode: target
                });
            }
        });

        return { nodes: Array.from(nodeMap.values()), links: validLinks };
    }, [visData, filterLabel]);

    // Mouse handlers for canvas panning
    const handleMouseDown = (e) => {
        if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleResetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setSelectedNode(null);
    };

    const activeQueryObj = QUERIES.find(q => q.id === selectedQueryId);

    return (
        <div className="module-container graph-analytics-container">
            {/* 1. Header Section */}
            <div className="module-header">
                <div className="module-title-section">
                    <h2>Graph Analytics & Management (DA3)</h2>
                    <p>Neo4j Property Graph Database Integration & High-Value Graph Queries</p>
                </div>
                <div className="graph-header-actions">
                    <span className={`status-badge ${health && health.status === 'UP' ? 'badge-up' : 'badge-down'}`}>
                        <span className="status-dot"></span>
                        Neo4j: {health ? health.status : 'CHECKING...'} ({health?.database || 'neo4j'})
                    </span>
                    <button className="btn-secondary" onClick={loadOverview} disabled={loadingStats}>
                        {loadingStats ? 'Refreshing...' : 'Refresh Status'}
                    </button>
                </div>
            </div>

            {statsError && <div className="error-message">{statsError}</div>}

            {/* 2. Top-Level Summary Metric Cards */}
            <div className="graph-stats-grid">
                <div className="graph-stat-card">
                    <div className="graph-stat-title">Total Nodes</div>
                    <div className="graph-stat-value">{stats ? stats.totalNodes : '--'}</div>
                    <div className="graph-stat-sub">Verified in CooperativeDA3</div>
                </div>
                <div className="graph-stat-card">
                    <div className="graph-stat-title">Total Relationships</div>
                    <div className="graph-stat-value">{stats ? stats.totalRelationships : '--'}</div>
                    <div className="graph-stat-sub">Directed labeled edges</div>
                </div>
                <div className="graph-stat-card">
                    <div className="graph-stat-title">Entity Labels</div>
                    <div className="graph-stat-value">{stats && stats.nodeLabels ? Object.keys(stats.nodeLabels).length : '--'}</div>
                    <div className="graph-stat-sub">9 Core Graph Labels</div>
                </div>
                <div className="graph-stat-card">
                    <div className="graph-stat-title">Relationship Types</div>
                    <div className="graph-stat-value">{stats && stats.relationshipTypes ? Object.keys(stats.relationshipTypes).length : '--'}</div>
                    <div className="graph-stat-sub">Direct Index-Free Edges</div>
                </div>
            </div>

            {/* Label Pills Breakdown */}
            {stats && stats.nodeLabels && (
                <div className="graph-pills-bar">
                    <span className="pills-title">Node Labels:</span>
                    {Object.entries(stats.nodeLabels).map(([label, count]) => (
                        <span
                            key={label}
                            className="label-pill"
                            style={{ borderColor: LABEL_COLORS[label] || '#a0aec0', color: LABEL_COLORS[label] || '#2d3748' }}
                        >
                            <span className="pill-color-dot" style={{ backgroundColor: LABEL_COLORS[label] || '#a0aec0' }}></span>
                            {label}: <strong>{count}</strong>
                        </span>
                    ))}
                </div>
            )}

            {/* 3. Section Navigation Tabs */}
            <div className="graph-section-tabs">
                <button
                    className={`section-tab-btn ${activeSection === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveSection('analytics')}
                >
                    📊 6 Graph Analytical Queries
                </button>
                <button
                    className={`section-tab-btn ${activeSection === 'visualizer' ? 'active' : ''}`}
                    onClick={() => setActiveSection('visualizer')}
                >
                    🕸️ Interactive Graph Visualizer
                </button>
            </div>

            {/* ========================================================================= */}
            {/* SECTION A: GRAPH ANALYTICS (The 6 Verified Cypher Queries)                */}
            {/* ========================================================================= */}
            {activeSection === 'analytics' && (
                <div className="analytics-section">
                    {/* Query Selector List */}
                    <div className="query-selector-row">
                        {QUERIES.map(q => (
                            <button
                                key={q.id}
                                className={`query-card-btn ${selectedQueryId === q.id ? 'active' : ''}`}
                                onClick={() => setSelectedQueryId(q.id)}
                            >
                                <span className="query-tag">{q.tag}</span>
                                <div className="query-btn-title">{q.title}</div>
                            </button>
                        ))}
                    </div>

                    {/* Active Query Details & Execution */}
                    {activeQueryObj && (
                        <div className="query-detail-box">
                            <div className="query-detail-header">
                                <div>
                                    <h3>{activeQueryObj.title}</h3>
                                    <p className="query-desc">{activeQueryObj.description}</p>
                                </div>
                                <button className="btn-primary" onClick={() => executeQuery(activeQueryObj.id)} disabled={queryLoading}>
                                    {queryLoading ? 'Executing Cypher...' : 'Execute Query'}
                                </button>
                            </div>

                            {/* Parameter Inputs if Query has parameters */}
                            {activeQueryObj.hasInputs && (
                                <div className="query-inputs-bar">
                                    {activeQueryObj.inputs.map(inp => (
                                        <div key={inp.name} className="input-group">
                                            <label htmlFor={inp.name}>{inp.label}:</label>
                                            <input
                                                id={inp.name}
                                                type={inp.type}
                                                value={queryInputs[inp.name] !== undefined ? queryInputs[inp.name] : inp.defaultValue}
                                                onChange={(e) => setQueryInputs({ ...queryInputs, [inp.name]: Number(e.target.value) })}
                                            />
                                        </div>
                                    ))}
                                    <button className="btn-secondary" onClick={() => executeQuery(activeQueryObj.id)} disabled={queryLoading}>
                                        Apply & Run
                                    </button>
                                </div>
                            )}

                            {/* Query Status / Error */}
                            {queryError && <div className="error-message">Error: {queryError}</div>}
                            {queryLoading && <div className="status-message">Executing Cypher traversal on Neo4j...</div>}

                            {/* Results Table */}
                            {!queryLoading && queryData && (
                                <div className="query-results-wrapper">
                                    {/* Specialized result view for Query 2 (Circular Nominees) */}
                                    {selectedQueryId === 'circular-nominees' && Array.isArray(queryData) && queryData.length > 0 && (
                                        <div className="audit-alert-box">
                                            ⚠️ <strong>Microfinance Collusion Detected:</strong> Mutual nominee cycle between{' '}
                                            <strong>{queryData[0].member1Name} (ID: {queryData[0].member1Id})</strong> and{' '}
                                            <strong>{queryData[0].member2Name} (ID: {queryData[0].member2Id})</strong>!
                                        </div>
                                    )}

                                    {/* Specialized result view for Query 4 (Shortest Path) */}
                                    {selectedQueryId === 'shortest-path' && (() => {
                                        const pathInfo = extractShortestPathData(queryData, queryInputs.member1Id ?? 1, queryInputs.member2Id ?? 3);
                                        
                                        if (!pathInfo) {
                                            return (
                                                <div className="status-message">
                                                    No path data available. Click "Apply &amp; Run" to execute the shortest path search.
                                                </div>
                                            );
                                        }

                                        if (pathInfo.isEmptyArray) {
                                            return (
                                                <div className="status-message">
                                                    No path records returned for Member {queryInputs.member1Id ?? 1} and Member {queryInputs.member2Id ?? 3}.
                                                </div>
                                            );
                                        }

                                        if (pathInfo.isInvalidFormat) {
                                            return (
                                                <div className="status-message">
                                                    Unexpected response format received: {String(pathInfo.raw)}
                                                </div>
                                            );
                                        }

                                        const { pathFound, networkHops, sourceMemberId, targetMemberId, pathEntities, relationshipTypes } = pathInfo;

                                        return (
                                            <div className="shortest-path-display">
                                                <div className="path-meta">
                                                    <span className={`path-status-badge ${pathFound ? 'badge-connected' : 'badge-disconnected'}`}>
                                                        {pathFound ? '✓ Path Connected' : '✕ No Connection'}
                                                    </span>
                                                    <span><strong>Distance:</strong> {networkHops} {networkHops === 1 ? 'Hop' : 'Hops'}</span>
                                                    <span><strong>Source:</strong> Member {sourceMemberId}</span>
                                                    <span><strong>Target:</strong> Member {targetMemberId}</span>
                                                </div>

                                                {pathFound && pathEntities.length > 0 ? (
                                                    <>
                                                        <div className="path-steps-container">
                                                            <span className="step-label">Path Lineage (Nodes &amp; Relationships):</span>
                                                            <div className="path-steps">
                                                                {pathEntities.map((ent, idx) => (
                                                                    <span key={idx} className="path-step-wrapper">
                                                                        <span className="path-step-pill" title={`Node ${idx + 1}`}>
                                                                            <span className="node-idx">{idx + 1}.</span> {ent}
                                                                        </span>
                                                                        {idx < pathEntities.length - 1 && (
                                                                            <span className="path-rel-container">
                                                                                <span className="path-arrow">➔</span>
                                                                                <span className="path-rel-tag">
                                                                                    {relationshipTypes && relationshipTypes[idx] ? `[:${relationshipTypes[idx]}]` : '[:CONNECTED]'}
                                                                                </span>
                                                                                <span className="path-arrow">➔</span>
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="path-table-wrapper" style={{ marginTop: '20px' }}>
                                                            <span className="step-label">Step-by-Step Traversal Table:</span>
                                                            <div className="table-responsive" style={{ marginTop: '8px' }}>
                                                                <table className="data-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: '70px' }}>Hop #</th>
                                                                            <th>Origin Entity (From)</th>
                                                                            <th>Traversed Relationship</th>
                                                                            <th>Destination Entity (To)</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {pathEntities.slice(0, -1).map((ent, idx) => (
                                                                            <tr key={idx}>
                                                                                <td><strong>{idx + 1}</strong></td>
                                                                                <td><span className="entity-badge">{ent}</span></td>
                                                                                <td><span className="path-rel-tag">[:{relationshipTypes && relationshipTypes[idx] ? relationshipTypes[idx] : 'CONNECTED'}]</span></td>
                                                                                <td><span className="entity-badge">{pathEntities[idx + 1]}</span></td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="status-message" style={{ margin: '12px 0 0' }}>
                                                        No graph relationship path connects Member {sourceMemberId} and Member {targetMemberId} across cooperative societies, groups, loans, or savings nominees.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Standard Data Table for Other Queries */}
                                    {selectedQueryId !== 'shortest-path' && Array.isArray(queryData) && queryData.length > 0 && (
                                        <div className="table-responsive">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        {Object.keys(queryData[0]).map(col => (
                                                            <th key={col}>{formatColumnHeader(col)}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {queryData.map((row, rIdx) => (
                                                        <tr key={rIdx}>
                                                            {Object.entries(row).map(([k, val], cIdx) => (
                                                                <td key={cIdx}>
                                                                    {formatCellValue(k, val)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {selectedQueryId !== 'shortest-path' && Array.isArray(queryData) && queryData.length === 0 && (
                                        <div className="status-message">Query executed successfully, but returned 0 rows matching criteria.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION B: INTERACTIVE GRAPH VISUALIZER                                   */}
            {/* ========================================================================= */}
            {activeSection === 'visualizer' && (
                <div className="visualizer-section">
                    {/* Visualizer Controls */}
                    <div className="vis-controls-bar">
                        <div className="vis-filters">
                            <span className="control-label">Filter Label:</span>
                            {['ALL', 'Member', 'Loan', 'SavingsAccount', 'CooperativeGroup', 'CooperativeSociety', 'VillageArea', 'Fund', 'Staff'].map(lbl => (
                                <button
                                    key={lbl}
                                    className={`pill-filter-btn ${filterLabel === lbl ? 'active' : ''}`}
                                    onClick={() => setFilterLabel(lbl)}
                                >
                                    {lbl}
                                </button>
                            ))}
                        </div>

                        <div className="vis-actions">
                            <span className="control-label">Limit:</span>
                            <select
                                className="vis-limit-select"
                                value={visLimit}
                                onChange={(e) => {
                                    const lim = Number(e.target.value);
                                    setVisLimit(lim);
                                    loadVisualization(lim);
                                }}
                            >
                                <option value={50}>50 Nodes</option>
                                <option value={100}>100 Nodes</option>
                                <option value={200}>200 Nodes</option>
                            </select>
                            <span className="control-label" style={{ marginLeft: '8px' }}>
                                Nodes: {computedGraph.nodes.length} | Edges: {computedGraph.links.length}
                            </span>
                            <button className="btn-secondary" onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}>Zoom +</button>
                            <button className="btn-secondary" onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}>Zoom -</button>
                            <button className="btn-secondary" onClick={handleResetView}>Reset View</button>
                            <button className="btn-primary" onClick={() => loadVisualization(visLimit)} disabled={visLoading}>
                                {visLoading ? 'Loading...' : 'Reload Graph'}
                            </button>
                        </div>
                    </div>

                    {visError && <div className="error-message">Error: {visError}</div>}
                    {visLoading && <div className="status-message">Loading Neo4j nodes and relationships...</div>}

                    {/* Canvas & Inspector Split View */}
                    <div className="vis-stage-wrapper">
                        <div
                            className="svg-canvas-container"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            <svg
                                ref={svgRef}
                                className="graph-svg"
                                viewBox="0 0 850 550"
                                width="100%"
                                height="550"
                            >
                                <defs>
                                    <marker
                                        id="arrow"
                                        viewBox="0 0 10 10"
                                        refX="22"
                                        refY="5"
                                        markerWidth="6"
                                        markerHeight="6"
                                        orient="auto-start-reverse"
                                    >
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#a0aec0" />
                                    </marker>
                                </defs>

                                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                                    {/* 1. Draw Links (Edges) */}
                                    {computedGraph.links.map((link) => {
                                        const isSelected = selectedNode &&
                                            (selectedNode.id === link.sourceNode.id || selectedNode.id === link.targetNode.id);
                                        const midX = (link.sourceNode.x + link.targetNode.x) / 2;
                                        const midY = (link.sourceNode.y + link.targetNode.y) / 2;

                                        return (
                                            <g key={link.id} className="graph-edge-group">
                                                <line
                                                    x1={link.sourceNode.x}
                                                    y1={link.sourceNode.y}
                                                    x2={link.targetNode.x}
                                                    y2={link.targetNode.y}
                                                    stroke={isSelected ? '#3182ce' : '#cbd5e0'}
                                                    strokeWidth={isSelected ? 2.5 : 1.2}
                                                    markerEnd="url(#arrow)"
                                                />
                                                <text
                                                    x={midX}
                                                    y={midY}
                                                    fill="#718096"
                                                    fontSize="9"
                                                    textAnchor="middle"
                                                    dy="-3"
                                                    className="edge-type-label"
                                                >
                                                    {link.type}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* 2. Draw Nodes */}
                                    {computedGraph.nodes.map((node) => {
                                        const isSelected = selectedNode && selectedNode.id === node.id;
                                        return (
                                            <g
                                                key={node.id}
                                                className={`graph-node-group ${isSelected ? 'selected' : ''}`}
                                                transform={`translate(${node.x}, ${node.y})`}
                                                onClick={() => setSelectedNode(node)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <circle
                                                    r={isSelected ? 22 : 16}
                                                    fill={node.color}
                                                    stroke={isSelected ? '#2b6cb0' : '#fff'}
                                                    strokeWidth={isSelected ? 3 : 2}
                                                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                                                />
                                                <text
                                                    textAnchor="middle"
                                                    dy="4"
                                                    fill="#fff"
                                                    fontSize="10"
                                                    fontWeight="bold"
                                                    pointerEvents="none"
                                                >
                                                    {node.label ? node.label.charAt(0) : 'N'}
                                                </text>
                                                <text
                                                    textAnchor="middle"
                                                    dy="28"
                                                    fill="#2d3748"
                                                    fontSize="10"
                                                    fontWeight="500"
                                                    className="node-caption-text"
                                                >
                                                    {node.caption}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </g>
                            </svg>
                        </div>

                        {/* Node Properties Inspector Panel */}
                        <div className="node-inspector-panel">
                            <h4>Graph Node Inspector</h4>
                            {selectedNode ? (
                                <div className="inspector-content">
                                    <div className="inspector-badge" style={{ backgroundColor: selectedNode.color }}>
                                        {selectedNode.label}
                                    </div>
                                    <div className="inspector-caption">{selectedNode.caption}</div>

                                    <div className="props-table-wrapper">
                                        <table className="props-table">
                                            <tbody>
                                                <tr>
                                                    <th>Internal ID</th>
                                                    <td><code>{selectedNode.id}</code></td>
                                                </tr>
                                                {selectedNode.properties && Object.entries(selectedNode.properties).map(([k, v]) => (
                                                    <tr key={k}>
                                                        <th>{k}</th>
                                                        <td>
                                                            {Array.isArray(v)
                                                                ? v.join(', ')
                                                                : typeof v === 'object' && v !== null
                                                                    ? JSON.stringify(v)
                                                                    : String(v)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className="btn-secondary" style={{ marginTop: '12px' }} onClick={() => setSelectedNode(null)}>
                                        Clear Selection
                                    </button>
                                </div>
                            ) : (
                                <div className="inspector-empty">
                                    <p>Click any node circle in the graph to inspect its properties and relationships.</p>
                                    <div className="vis-legend-box">
                                        <h5>Legend</h5>
                                        {Object.entries(LABEL_COLORS).filter(([k]) => k !== 'Entity').map(([lbl, clr]) => (
                                            <div key={lbl} className="legend-item">
                                                <span className="legend-dot" style={{ backgroundColor: clr }}></span>
                                                <span>{lbl}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper formatters
function formatColumnHeader(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

function formatCellValue(key, val) {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'number') {
        if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('borrowed') || key.toLowerCase().includes('repaid') || key.toLowerCase().includes('exposure') || key.toLowerCase().includes('disbursed')) {
            return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return val;
    }
    if (Array.isArray(val)) {
        return val.join(', ');
    }
    if (typeof val === 'boolean') {
        return val ? 'Yes' : 'No';
    }
    return String(val);
}

// Safely parses array property that may be an array, JSON string, or string representation "[a, b, c]"
function parseArrayProperty(val) {
    if (!val) return [];
    if (Array.isArray(val)) {
        return val.map(item => (item !== null && item !== undefined ? String(item).trim() : '')).filter(Boolean);
    }
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            const inner = trimmed.slice(1, -1).trim();
            if (!inner) return [];
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return parsed.map(item => (item !== null && item !== undefined ? String(item).trim() : '')).filter(Boolean);
                }
            } catch (_) {}
            return inner.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
        }
        return [trimmed];
    }
    return [String(val)];
}

// Normalizes shortest path response across various API structures (single object, array of objects, etc.)
function extractShortestPathData(data, defaultM1 = 1, defaultM2 = 3) {
    if (!data) return null;
    let target = data;
    if (Array.isArray(data)) {
        if (data.length === 0) return { isEmptyArray: true };
        target = data[0];
    }
    if (typeof target !== 'object' || target === null) {
        return { isInvalidFormat: true, raw: String(data) };
    }

    const pathEntities = parseArrayProperty(target.pathEntities || target.PathEntities || target.nodes);
    const relationshipTypes = parseArrayProperty(target.relationshipTypes || target.RelationshipTypes || target.relationships);
    const pathFound = target.pathFound !== undefined 
        ? Boolean(target.pathFound) 
        : (pathEntities.length > 1);
    
    const networkHops = target.networkHops !== undefined 
        ? Number(target.networkHops) 
        : (pathEntities.length > 1 ? pathEntities.length - 1 : 0);
        
    const sourceMemberId = target.sourceMemberId ?? target.member1Id ?? defaultM1;
    const targetMemberId = target.targetMemberId ?? target.member2Id ?? defaultM2;

    return {
        pathFound,
        networkHops,
        sourceMemberId,
        targetMemberId,
        pathEntities,
        relationshipTypes,
        raw: target
    };
}

export default GraphAnalytics;

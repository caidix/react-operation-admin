import React, { useState } from 'react';
export interface Iprops<T> {
  maxLevel: number;
  data: T[];
  rowKey?: string;
}
const getLevelEnums = (num: number) => {
  return Array.from(new Array(num), (i, len) => len + 1);
};

const useLevelExpand = <T, R = T>(props: Iprops<T>): [() => JSX.Element, any] => {
  const { data, maxLevel, rowKey = 'key' } = props;
  const levels = getLevelEnums(maxLevel);
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);

  const handleExpand = (expanded: any, record: any) => {
    if (expanded) {
      if (!expandedKeys.includes(record[rowKey])) {
        expandedKeys.push(record[rowKey]);
      }
    } else {
      setExpandedKeys(expandedKeys.filter((key) => key !== record[rowKey]));
    }
  };

  const handleLevelExpand = (floor: number) => {
    const res: number[] = [];
    const datamap = (forms: any[], floor: number) => {
      if (floor < 1) return;
      forms.forEach((item) => {
        if (item.children && item.children.length) {
          res.push(item[rowKey]);
          datamap(item.children, floor - 1);
        }
      });
    };
    datamap(data, floor - 1);
    setPicked(floor);
    setExpandedKeys(res);
  };

  const Level = () => {
    const getStyle = (level: number): React.CSSProperties => {
      const activeStyle =
        picked === level ? { backgroundColor: '#0078fd', color: '#fff', border: '1px solid #0078fd' } : {};
      return {
        display: 'inline-block',
        width: '22px',
        height: '22px',
        fontSize: '12px',
        textAlign: 'center',
        lineHeight: '20px',
        cursor: 'pointer',
        transition: 'all 0.25s',
        marginLeft: ' 8px',
        border: '1px solid transparent',
        borderRadius: '50%',
        ...activeStyle,
      };
    };
    return (
      <span>
        {levels.map((level) => (
          <span key={level} onClick={() => handleLevelExpand(level)}>
            {/* {picked === level ? <ActiveBtn>{level}</ActiveBtn> : <Btn>{level}</Btn>} */}
            <span style={getStyle(level)}>{level}</span>
          </span>
        ))}
      </span>
    );
  };

  return [
    Level,
    {
      onExpand: handleExpand,
      expandedRowKeys: expandedKeys,
    },
  ];
};

export default useLevelExpand;

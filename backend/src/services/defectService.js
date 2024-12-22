const defectService = {
    createDefect: async (defectData) => {
      const { type, description, process, date, userId } = defectData;
      const [result] = await pool.execute(
        'INSERT INTO defects (type, description, process, date, user_id) VALUES (?, ?, ?, ?, ?)',
        [type, description, process, date, userId]
      );
      return { id: result.insertId, ...defectData };
    },
  
    getAllDefects: async (filters = {}) => {
      let query = 'SELECT * FROM defects WHERE 1=1';
      const params = [];
  
      if (filters.type) {
        query += ' AND type = ?';
        params.push(filters.type);
      }
  
      if (filters.process) {
        query += ' AND process = ?';
        params.push(filters.process);
      }
  
      if (filters.startDate && filters.endDate) {
        query += ' AND date BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
      }
  
      const [defects] = await pool.execute(query, params);
      return defects;
    },
  
    getDefectById: async (id) => {
      const [defects] = await pool.execute(
        'SELECT * FROM defects WHERE id = ?',
        [id]
      );
      return defects[0];
    },
  
    updateDefect: async (id, defectData) => {
      const { type, description, process, date } = defectData;
      await pool.execute(
        'UPDATE defects SET type = ?, description = ?, process = ?, date = ? WHERE id = ?',
        [type, description, process, date, id]
      );
      return { id, ...defectData };
    },
  
    deleteDefect: async (id) => {
      await pool.execute('DELETE FROM defects WHERE id = ?', [id]);
      return true;
    }
  };
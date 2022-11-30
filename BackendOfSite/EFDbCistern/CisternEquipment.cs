using System;
using System.Collections.Generic;

namespace BackendOfSite.EFDbCistern;

/// <summary>
/// Таблица, которая связывает Таблицу Резервуар и Таблицу Оборудование
/// </summary>
public partial class CisternEquipment
{
    public int CisternEquipmentId { get; set; }

    public int CisternId { get; set; }

    public int EquipmentId { get; set; }

    public int MinCount { get; set; }

    public int MaxCount { get; set; }

    public virtual Cistern Cistern { get; set; } = null!;

    public virtual Equipment Equipment { get; set; } = null!;
}

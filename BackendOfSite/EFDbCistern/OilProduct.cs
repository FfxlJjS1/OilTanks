using System;
using System.Collections.Generic;

namespace BackendOfSite.EFDbCistern;

/// <summary>
/// Таблица Нефтепродукт
/// </summary>
public partial class OilProduct
{
    public int OilProductId { get; set; }

    /// <summary>
    /// Название нефтепродукта
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Плотность, г/cм3
    /// </summary>
    public decimal? DensityGCm3 { get; set; }

    /// <summary>
    /// Скорость отстоя, секунды
    /// </summary>
    public int? SpeedSettlingSec { get; set; }
}

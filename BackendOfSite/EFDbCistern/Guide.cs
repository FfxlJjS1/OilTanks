using System;
using System.Collections.Generic;

namespace BackendOfSite.EFDbCistern;

/// <summary>
/// Таблица Справочник
/// </summary>
public partial class Guide
{
    public int GuideId { get; set; }

    public int Tip { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Cistern> CisternBottomProductionGs { get; } = new List<Cistern>();

    public virtual ICollection<Cistern> CisternBottomSlopeGs { get; } = new List<Cistern>();

    public virtual ICollection<Cistern> CisternLadderConstructionGs { get; } = new List<Cistern>();

    public virtual ICollection<Cistern> CisternRoofStConstructionGs { get; } = new List<Cistern>();

    public virtual ICollection<Cistern> CisternRoofStFormGs { get; } = new List<Cistern>();

    public virtual ICollection<Cistern> CisternWallProductionGs { get; } = new List<Cistern>();

    public virtual ICollection<StandartSludge> StandartSludges { get; } = new List<StandartSludge>();
}

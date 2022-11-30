using System;
using System.Collections.Generic;

namespace BackendOfSite.EFDbCistern;

public partial class StandartSludge
{
    public int DebetId { get; set; }

    public int GuideId { get; set; }

    public int? DevonHour { get; set; }

    public int? SulfuricHour { get; set; }

    public virtual Guide Guide { get; set; } = null!;
}
